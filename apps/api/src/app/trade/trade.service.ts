import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {DataSource, Repository} from "typeorm";
import {TradeAssetService} from "../trade-asset/trade-asset.service";
import {
	CreateTrade,
	FindTradeQueryParams,
	Trade,
	TradeAssetType,
	TradeClosureReason,
	TradeStatus,
	TransactionStatus,
	TransactionStatusEnum,
	TransactionType,
	UpdateTrade,
	User
} from "@coinvant/types";
import {paginate} from "nestjs-typeorm-paginate";
import {Cron, CronExpression} from "@nestjs/schedule";
import axios from "axios";
import {TransactionService} from "../transaction/transaction.service";
import {UserService} from "../user/user.service";

@Injectable()
export class TradeService {
	constructor(
		@InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>,
		private dataSource: DataSource,
		private readonly tradeAssetService: TradeAssetService,
		private readonly transactionService: TransactionService,
		private readonly userService: UserService
	) {}

	private getCurrentPriceForStock = async (symbol: string) => {
		const { data } = await axios.get(`https://www.alphavantage.co/query`, {
			params: {
				function: 'TIME_SERIES_INTRADAY',
				symbol: symbol,
				interval: '5min',
				apikey: '4SSFX5O7DOW5SK3C',
			},
		});

		const timeSeries = data['Time Series (5min)'];
		const latestTime = Object.keys(timeSeries)[0];
		const latestData = timeSeries[latestTime];
		return parseFloat(latestData['1. open']);
	}

	private getCurrentPriceForForex = async (symbol: string) => {
		const [base, term] = symbol.split('/');
		const { data } = await axios.get(`https://api.frankfurter.app/latest?amount=1&from=${base}&to=${term}`);
		return data.rates[term];
	}

	private getCurrentPriceForCrypto = async (currencyID: string) => {
		const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyID}`);
		return data[0].current_price;
	}

	private async getCurrentAssetPrice(assetType: TradeAssetType, symbol?: string): Promise<number> {
		if (assetType === TradeAssetType.stock) {
			return this.getCurrentPriceForStock(symbol);
		} else if (assetType === TradeAssetType.crypto) {
			return this.getCurrentPriceForCrypto(symbol);
		} else {
			return this.getCurrentPriceForForex(symbol);
		}
	}

	private async shouldOpenTrade(trade: Trade) {
		if (trade.executeAt && new Date() >= new Date(trade.executeAt)) {
			return true;
		}
		// @ts-ignore
		const currentPrice = await this.getCurrentAssetPrice(trade.assetType, trade.asset.currencyID || trade.asset.symbol);

		if (trade.sellPrice && trade.sellPrice >= currentPrice) {
			return true
		}

		if (trade.buyPrice && trade.buyPrice <= currentPrice) {
			return true;
		}
	}

	private calculatePLForCrypto(trade: Trade, currentPrice: number) {
		let priceMovement: number;
		if (trade.isShort) {
			priceMovement = trade.sellPrice - currentPrice;
		} else {
			priceMovement = currentPrice - trade.buyPrice;
		}
		return trade.units * trade.leverage * priceMovement;
	}

	private async calculatePLForForex(trade: Trade, currentPrice: number) {
		let priceMovement: number;
		if (trade.isShort) {
			priceMovement = trade.sellPrice - currentPrice;
		} else {
			priceMovement = currentPrice - trade.buyPrice;
		}
		const profitOrLoss = trade.units * priceMovement;
		const [base, term] = trade.asset.symbol.split('/');
		if (base === 'USD') {
			return profitOrLoss / currentPrice;
		} else if (term === 'USD') {
			return profitOrLoss;
		}
		const rate = await this.getCurrentPriceForForex(`${term}/USD`);
		return profitOrLoss * rate;
	}

	private calculatePLForStock(trade: Trade, currentPrice: number) {
		let priceMovement: number;
		if (trade.isShort) {
			priceMovement = trade.sellPrice - currentPrice;
		} else {
			priceMovement = currentPrice - trade.buyPrice;
		}
		return trade.units * priceMovement;
	}

	private calculateProfitOrLoss(trade: Trade, currentPrice: number) {
		if (trade.assetType === TradeAssetType.stock) {
			return this.calculatePLForStock(trade, currentPrice);
		} else if (trade.assetType === TradeAssetType.crypto) {
			return this.calculatePLForCrypto(trade, currentPrice);
		}
		return this.calculatePLForForex(trade, currentPrice);
	}

	private async checkAndCloseTrade(trade: Trade, forceClose?: boolean) {
		const queryRunner = this.dataSource.createQueryRunner();
		try {
			// @ts-ignore
			const currentPrice = await this.getCurrentAssetPrice(trade.assetType, trade.asset.currencyID || trade.asset.symbol);
			let profitOrLoss = 0;
			let shouldClose = false;
			let reason: TradeClosureReason;

			if (forceClose) {
				shouldClose = true;
				reason = TradeClosureReason.user;
				profitOrLoss = await this.calculateProfitOrLoss(trade, currentPrice);
			}

			if (trade.takeProfit) {
				if (trade.isShort && currentPrice <= trade.takeProfit
					|| !trade.isShort && currentPrice >= trade.takeProfit) {
					shouldClose = true;
					reason = TradeClosureReason.takeProfit;
					profitOrLoss = await this.calculateProfitOrLoss(trade, trade.takeProfit);
				}
			}

			if (trade.stopLoss) {
				if (trade.isShort && currentPrice >= trade.stopLoss
					|| !trade.isShort && currentPrice <= trade.stopLoss) {
					shouldClose = true;
					reason = TradeClosureReason.stopLoss;
					profitOrLoss = await this.calculateProfitOrLoss(trade, trade.stopLoss);
				}
			}

			if (!shouldClose) {
				if ((+trade.bidAmount) + Number(profitOrLoss) <= 0) {
					shouldClose = true;
					reason = TradeClosureReason.stopOut;
					profitOrLoss = trade.bidAmount * -1;
				}
			}

			if (shouldClose) {
				let remainder = trade.bidAmount;
				if (profitOrLoss < 0) {
					remainder = trade.bidAmount + profitOrLoss;
				}
				await this.userService.update(trade.user.id, {
					walletBalance: (+trade.user.walletBalance) + Number(profitOrLoss) + remainder,
				}, queryRunner);
				await queryRunner.manager.update(TradeEntity, trade.id, {
					profitOrLoss,
					closedAt: new Date().toDateString(),
					buyPrice: trade.isShort ? currentPrice : trade.buyPrice,
					sellPrice: trade.isShort ? trade.sellPrice : currentPrice,
					closureReason: reason,
					status: TradeStatus.closed,
				});
				await this.transactionService.update(trade.id, {
					status: (TransactionStatusEnum.closed as unknown) as TransactionStatus,
				}, queryRunner);
			}
		} catch (e) {
			console.error(e);
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	private getAssetObject(assetType: TradeAssetType, asset: any) {
		if (asset) {
			switch (assetType) {
				case TradeAssetType.stock:
					return { stock: asset };
				case TradeAssetType.forex:
					return { forex: asset };
				default:
					return { crypto: asset };
			}
		} else {
			throw new NotFoundException('Asset not found');
		}
	}

	private async getUnits(assetType: TradeAssetType, currentPrice: number, bidAmount: number, leverage = 1, symbol?: string) {
		if (assetType === TradeAssetType.stock
			|| assetType === TradeAssetType.crypto) {
			return bidAmount * leverage / currentPrice;
		}
		const [base, term] = symbol.split('/');
		if (base === 'USD') {
			return bidAmount * leverage;
		} else if (term === 'USD') {
			return bidAmount * leverage / currentPrice;
		}
		const rate = await this.getCurrentPriceForForex(`${base}/USD`);
		return bidAmount * leverage / rate;
	}

	async create(createTrade: CreateTrade, user: User) {
		if ((+user.walletBalance) < (+createTrade.bidAmount)) {
			throw new BadRequestException('Insufficient funds');
		}
		const queryRunner = this.dataSource.createQueryRunner();
		try {
			const asset = await this.tradeAssetService.findAsset(createTrade.assetID, createTrade.assetType);
			let obj = {
				...createTrade,
				...this.getAssetObject(createTrade.assetType, asset),
				user,
			}
			await this.userService.update(user.id, {
				walletBalance: (+user.walletBalance) - (+createTrade.bidAmount),
			}, queryRunner);
			if (createTrade.openingPrice || createTrade.executeAt) {
				if (createTrade.openingPrice) {
					if (createTrade.isShort) {
						obj['sellPrice'] = createTrade.openingPrice;
					} else {
						obj['buyPrice'] = createTrade.openingPrice;
					}
				}
				obj['status'] = TradeStatus.pending;
			} else {
				// @ts-ignore
				const openingPrice = await this.getCurrentAssetPrice(createTrade.assetType, asset.currencyID || asset.symbol);
				obj['units'] = await this.getUnits(createTrade.assetType, openingPrice, createTrade.bidAmount, createTrade.leverage, asset.symbol);
				if (createTrade.isShort) {
					obj['sellPrice'] = openingPrice;
				} else {
					obj['buyPrice'] = openingPrice;
				}
				obj['status'] = TradeStatus.active;
				obj['executeAt'] = new Date().toDateString();
			}
			const trade = await queryRunner.manager.save(TradeEntity, obj);
			await this.transactionService.create({
				type: TransactionType.trade,
				user,
				status: obj['status'],
				amount: createTrade.bidAmount,
				transactionID: trade.id,
			}, queryRunner);
			return trade;
		} catch (e) {
			console.error(e);
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	findAll(query: FindTradeQueryParams) {
		const { status, assetType, ...options } = query;
		const queryBuilder = this.tradeRepo.createQueryBuilder('T')
			.leftJoinAndSelect('T.user', 'user')
			.leftJoinAndSelect('T.crypto', 'crypto')
			.leftJoinAndSelect('T.stock', 'stock')
			.leftJoinAndSelect('T.forex', 'forex');
		if (status) {
			queryBuilder.andWhere('T.status = :status', { status });
		}
		if (assetType) {
			queryBuilder.andWhere('T.assetType = :assetType', { assetType });
		}
		queryBuilder
			.orderBy('CASE WHEN T.status = :active THEN 1 ELSE 2 END', 'ASC')
			.addOrderBy('T.createdAt', 'DESC')
			.setParameter('active', TradeStatus.active);
		return paginate(queryBuilder, options);
	}

	findOne(id: string) {
		return this.tradeRepo.findOne({ where: { id } });
	}

	async update(id: string, updateTrade: UpdateTrade) {
		const trade = await this.findOne(id);
		if (trade) {
			const queryRunner = this.dataSource.createQueryRunner();
			try {
				if (updateTrade.status === TradeStatus.cancelled) {
					await this.userService.update(trade.user.id, {
						walletBalance: (+trade.user.walletBalance) + (+trade.bidAmount),
					}, queryRunner);
					await this.transactionService.update(trade.id, {
						status: (TransactionStatusEnum.cancelled as unknown) as TransactionStatus,
					}, queryRunner);
					return queryRunner.manager.update(TradeEntity, id, updateTrade);
				} else if (updateTrade.status === TradeStatus.closed) {
					await this.checkAndCloseTrade(trade, true);
				}
				return trade;
			} catch (e) {
				console.error(e);
				await queryRunner.rollbackTransaction();
				throw e;
			} finally {
				await queryRunner.release();
			}
		}
		throw new NotFoundException('Trade not found');
	}

	remove(id: string) {
		return this.tradeRepo.delete(id);
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async checkPendingTrades() {
		const pendingTrades = await this.tradeRepo.find({
			where: { status: TradeStatus.pending }
		});
		for (const trade of pendingTrades) {
			const shouldOpen = await this.shouldOpenTrade(trade);
			if (shouldOpen) {
				let obj = { status: TradeStatus.active };
				if (!trade.buyPrice && !trade.sellPrice) {
					// @ts-ignore
					const openingPrice = await this.getCurrentAssetPrice(trade.assetType, trade.asset.currencyID || trade.asset.symbol);
					if (trade.isShort) {
						obj['sellPrice'] = openingPrice;
					} else {
						obj['buyPrice'] = openingPrice;
					}
				}
				if (!trade.executeAt) {
					obj['executeAt'] = new Date().toDateString();
				}
				const openingPrice = trade.buyPrice || trade.sellPrice || obj['buyPrice'] || obj['sellPrice'];
				obj['units'] = await this.getUnits(trade.assetType, openingPrice, trade.bidAmount, trade.leverage, trade.asset.symbol);
				await this.tradeRepo.update(trade.id, obj);
			}
		}
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async checkActiveTrades() {
		const openTrades = await this.tradeRepo.find({
			where: { status: TradeStatus.active },
		});

		for (const trade of openTrades) {
			await this.checkAndCloseTrade(trade);
		}
	}
}

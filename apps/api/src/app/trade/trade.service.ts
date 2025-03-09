import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {DataSource, Repository} from "typeorm";
import {TradeAssetService} from "../trade-asset/trade-asset.service";
import {
	CreateTrade,
	FindTradesQueryParams, Trade, TradeAsset, TradeAssetType, TradeClosureReason,
	TradeStatus,
	TransactionStatus,
	TransactionStatusEnum,
	TransactionType,
	UpdateTrade, User, UserRole
} from '@coinvant/types';
import {paginate} from "nestjs-typeorm-paginate";
import {TransactionService} from "../transaction/transaction.service";
import { AccountService } from '../account/account.service';
import { EmailService } from '../email/email.service';
import { environment } from '../../../environments/environment';
import { calculateProfitOrLoss, getCurrentAssetPrice, getUnits } from './helpers';

@Injectable()
export class TradeService {
	constructor(
		@InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>,
		private dataSource: DataSource,
		private readonly tradeAssetService: TradeAssetService,
		private readonly transactionService: TransactionService,
		private readonly accountService: AccountService,
		private readonly emailService: EmailService,
	) {}

	private getAssetObject(assetType: TradeAssetType, asset: TradeAsset) {
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

	async checkAndCloseTrade(trade: Trade, forceClose?: boolean, currentPrice?: number) {
    // @ts-expect-error idk
    const symbol = trade.asset.currencyID || trade.asset.symbol;
    const queryRunner = this.dataSource.createQueryRunner();
		try {
      if (!currentPrice) {
        currentPrice = await getCurrentAssetPrice(trade.assetType, symbol);
      }
			let profitOrLoss = 0;
			let shouldClose = false;
			let reason: TradeClosureReason;

			if (forceClose) {
				shouldClose = true;
				reason = TradeClosureReason.user;
				profitOrLoss = await calculateProfitOrLoss(trade, currentPrice);
			} else if (
				trade.takeProfit
				&& ((trade.isShort && currentPrice <= trade.takeProfit)
					|| (!trade.isShort && currentPrice >= trade.takeProfit))) {
				shouldClose = true;
				reason = TradeClosureReason.takeProfit;
				profitOrLoss = await calculateProfitOrLoss(trade, trade.takeProfit);
			} else if (
				trade.stopLoss
				&& ((trade.isShort && currentPrice >= trade.stopLoss)
					|| (!trade.isShort && currentPrice <= trade.stopLoss))) {
				shouldClose = true;
				reason = TradeClosureReason.stopLoss;
				profitOrLoss = await calculateProfitOrLoss(trade, trade.stopLoss);
			} else if ((+trade.bidAmount) + Number(profitOrLoss) <= 0) {
				shouldClose = true;
				reason = TradeClosureReason.stopOut;
				profitOrLoss = trade.bidAmount * -1;
			}

			if (!shouldClose) {
				profitOrLoss = await calculateProfitOrLoss(trade, currentPrice);
				await queryRunner.manager.update(TradeEntity, trade.id, {
					profitOrLoss,
					currentPrice,
				});
			}

			if (shouldClose) {
				let remainder = trade.bidAmount;
				if (profitOrLoss < 0) {
					remainder = trade.bidAmount + profitOrLoss;
				}
				await this.accountService.increaseBalance(trade.account.id, Number(profitOrLoss) + remainder, queryRunner);
				await queryRunner.manager.update(TradeEntity, trade.id, {
					profitOrLoss,
					currentPrice,
					closedAt: new Date().toDateString(),
					buyPrice: trade.isShort ? currentPrice : trade.buyPrice,
					sellPrice: trade.isShort ? trade.sellPrice : currentPrice,
					closureReason: reason,
					status: TradeStatus.closed,
				});
				await this.transactionService.update(trade.id, {
					status: (TransactionStatusEnum.closed as unknown) as TransactionStatus,
				}, queryRunner);

				const {user} = trade.account;

				this.emailService.sendMail(user.email, 'Trade Order Closed', './user/order-closed', {
					name: user.name,
					orderID: trade.id,
					asset: trade.asset.symbol,
				}).catch(console.error);
			}
		} catch (e) {
			console.error(e);
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	async create(createTrade: CreateTrade, user: User) {
		const account = await this.accountService.findOne(createTrade.accountID);
		if ((+account.walletBalance) < (+createTrade.bidAmount)) {
			throw new BadRequestException('Insufficient funds');
		}
		const queryRunner = this.dataSource.createQueryRunner();
		try {
			const asset = await this.tradeAssetService.findAsset(createTrade.assetID, createTrade.assetType);
			const obj = {
				...createTrade,
				...this.getAssetObject(createTrade.assetType, asset),
				account,
			}
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
				// @ts-expect-error idk
				const openingPrice = await getCurrentAssetPrice(createTrade.assetType, asset.currencyID || asset.symbol);
				obj['currentPrice'] = openingPrice;
				obj['units'] = await getUnits(createTrade.assetType, openingPrice, createTrade.bidAmount, createTrade.leverage, asset.symbol);
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
				account,
				status: obj['status'],
				amount: createTrade.bidAmount,
				transactionID: trade.id,
			}, queryRunner);
      await this.accountService.decreaseBalance(account.id, createTrade.bidAmount, queryRunner);
			Promise.all([
				this.emailService.sendMail(user.email, 'Trade Order Placed', './user/new-order', {
					name: user.name,
					orderID: trade.id,
					asset: asset.symbol,
				}),
				this.emailService.sendMail(environment.supportEmail, 'New Trade Order', './admin/new-order', {
					name: user.name,
					orderID: trade.id,
					asset: asset.symbol,
					orderType: `${trade.assetType} (${trade.isShort ? 'Short Order' : 'Long Order'})`,
					amount: trade.bidAmount.toString(),
				}),
			]).catch(console.error);
			return trade;
		} catch (e) {
			console.error(e);
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	findAll(query: FindTradesQueryParams, user: User) {
		// eslint-disable-next-line prefer-const
		let { status, assetType, accountID, ...options } = query;
		const queryBuilder = this.tradeRepo.createQueryBuilder('TR')
			.leftJoinAndSelect('TR.crypto', 'crypto')
			.leftJoinAndSelect('TR.stock', 'stock')
			.leftJoinAndSelect('TR.forex', 'forex')
			.leftJoinAndSelect('TR.account', 'A');

		if (user.role === UserRole.admin) {
			queryBuilder.leftJoinAndSelect('A.user', 'U');
		}

		if (user.role === UserRole.user) {
			if (!accountID) {
				accountID = user.accounts[0].id;
			}
			queryBuilder.where('A.id = :accountID', { accountID });
		}

		if (status) {
			queryBuilder.andWhere('TR.status = :status', { status });
		}

		if (assetType) {
			queryBuilder.andWhere('TR.assetType = :assetType', { assetType });
		}

		queryBuilder
			.orderBy('CASE WHEN TR.status = :active THEN 1 ELSE 2 END', 'ASC')
			.addOrderBy('TR.createdAt', 'DESC')
			.setParameter('active', TradeStatus.active);

		return paginate(queryBuilder, options);
	}

	findOne(id: string) {
		return this.tradeRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
	}

	async update(id: string, updateTrade: UpdateTrade) {
		const trade = await this.findOne(id);
		if (trade) {
			const queryRunner = this.dataSource.createQueryRunner();
			try {
				if (updateTrade.status === TradeStatus.cancelled) {
					await this.accountService.increaseBalance(trade.account.id, trade.bidAmount, queryRunner);
					await this.transactionService.update(trade.id, {
						status: (TransactionStatusEnum.cancelled as unknown) as TransactionStatus,
					}, queryRunner);
					return queryRunner.manager.update(TradeEntity, id, updateTrade);
				} else if (updateTrade.status === TradeStatus.closed) {
					await this.checkAndCloseTrade(trade, true);
				} else if (!updateTrade.status) {
					if (updateTrade.takeProfit
						&& ((trade.isShort && +trade.currentPrice <= +updateTrade.takeProfit)
							|| !trade.isShort && +trade.currentPrice >= +updateTrade.takeProfit)) {
						return new BadRequestException('Please input a valid take profit parameter');
					}
					if (updateTrade.stopLoss
						&& ((trade.isShort && +trade.currentPrice >= +updateTrade.stopLoss)
							|| !trade.isShort && +trade.currentPrice <= +updateTrade.stopLoss)) {
						return new BadRequestException('Please input a valid stop loss parameter');
					}
					await queryRunner.manager.update(TradeEntity, id, updateTrade);
				}
				return this.findOne(id);
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
}

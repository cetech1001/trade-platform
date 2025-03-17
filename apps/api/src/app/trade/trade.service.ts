import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {TradeAssetService} from "../trade-asset/trade-asset.service";
import {
  CreateTrade, FindTradeAmountsQueryParams,
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
import { environment } from '../../environments/environment';
import { calculatePL, fetchAssetRate, getSymbol, getUnits } from './helpers';
import { UserService } from '../user/user.service';

@Injectable()
export class TradeService {
  private logger: Logger = new Logger(TradeService.name);

	constructor(
		@InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>,
		private dataSource: DataSource,
		private readonly tradeAssetService: TradeAssetService,
		private readonly transactionService: TransactionService,
		private readonly accountService: AccountService,
    private readonly userService: UserService,
		private readonly emailService: EmailService,
	) {}

  private async executeTransaction<T>(callback: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Transaction failed: ", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

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
    return this.executeTransaction(async (queryRunner) => {
      const symbol = getSymbol(trade.asset);

      if (!currentPrice) {
        currentPrice = await fetchAssetRate(trade.assetType, symbol);
      }

      let profitOrLoss: number;
      let shouldClose = false;
      let reason: TradeClosureReason;

      if (forceClose) {
        shouldClose = true;
        reason = TradeClosureReason.user;
        profitOrLoss = await calculatePL(trade, currentPrice);
      } else if (
        trade.takeProfit &&
        ((trade.isShort && currentPrice <= trade.takeProfit) ||
          (!trade.isShort && currentPrice >= trade.takeProfit))
      ) {
        shouldClose = true;
        reason = TradeClosureReason.takeProfit;
        profitOrLoss = await calculatePL(trade, trade.takeProfit);
      } else if (
        trade.stopLoss &&
        ((trade.isShort && currentPrice >= trade.stopLoss) ||
          (!trade.isShort && currentPrice <= trade.stopLoss))
      ) {
        shouldClose = true;
        reason = TradeClosureReason.stopLoss;
        profitOrLoss = await calculatePL(trade, trade.stopLoss);
      } else {
        profitOrLoss = await calculatePL(trade, currentPrice);
        if (Number(trade.bidAmount) + Number(profitOrLoss) <= 0) {
          shouldClose = true;
          reason = TradeClosureReason.stopOut;
          profitOrLoss = Number(trade.bidAmount) * -1;
        }
      }

      currentPrice = Number(currentPrice);
      profitOrLoss = Number(profitOrLoss);
      trade.bidAmount = Number(trade.bidAmount);

      if (!shouldClose) {
        await queryRunner.manager.update(TradeEntity, trade.id, {
          profitOrLoss,
          currentPrice,
        });
      } else {
        await this.accountService.increaseBalance(
          trade.account.id,
          trade.bidAmount + profitOrLoss,
          queryRunner
        );

        await queryRunner.manager.update(TradeEntity, trade.id, {
          profitOrLoss,
          currentPrice,
          closedAt: new Date().toISOString(),
          buyPrice: trade.isShort ? currentPrice : trade.buyPrice,
          sellPrice: trade.isShort ? trade.sellPrice : currentPrice,
          closureReason: reason,
          status: TradeStatus.closed,
        });

        await this.transactionService.update(
          trade.id,
          { status: (TransactionStatusEnum.closed as unknown) as TransactionStatus },
          queryRunner
        );

        const user = await this.userService.findByAccountID(trade.account.id);
        this.emailService.sendMail(
          user.email,
          'Trade Order Closed',
          './user/order-closed',
          {
            name: user.name,
            orderID: trade.id,
            asset: trade.asset.symbol,
          }
        ).catch(console.error);
      }
    });
  }

	async create(createTrade: CreateTrade, user: User) {
    return this.executeTransaction(async (queryRunner) => {
      const account = await this.accountService.findOne(createTrade.accountID);

      if ((+account.walletBalance) < (+createTrade.bidAmount)) {
        throw new BadRequestException('Insufficient funds');
      }

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
        const openingPrice = await fetchAssetRate(createTrade.assetType, getSymbol(asset));
        obj['currentPrice'] = openingPrice;
        obj['units'] = await getUnits(createTrade.assetType, openingPrice, createTrade.bidAmount, createTrade.leverage, asset.symbol);
        if (createTrade.isShort) {
          obj['sellPrice'] = openingPrice;
        } else {
          obj['buyPrice'] = openingPrice;
        }
        obj['status'] = TradeStatus.active;
        obj['executeAt'] = new Date().toISOString();
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
      ]).catch(error => {
        this.logger.error("Failed to send email(s): ", error);
      });

      return trade;
    });
	}

	async findAll(query: FindTradesQueryParams, user: User) {
    let { accountID } = query;
    const { status, assetType, ...options } = query;
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
      } else {
        const accounts = user.accounts.map((account) => account.id);
        if (!accounts.includes(accountID)) {
          accountID = user.accounts[0].id;
        }
      }
			queryBuilder.where('A.id = :accountID', { accountID });
		}

		if (status) {
			queryBuilder.andWhere('TR.status = :status', { status });
		} else if (user.role === UserRole.user) {
      queryBuilder.andWhere('TR.status != :status', { status: TradeStatus.pending });
    }

		if (assetType) {
			queryBuilder.andWhere('TR.assetType = :assetType', { assetType });
		}

		queryBuilder
			.orderBy('TR.createdAt', 'DESC')
			.setParameter('active', TradeStatus.active);

		return paginate(queryBuilder, options);
	}

  async fetchTotalActivePL(query: FindTradeAmountsQueryParams, user: User) {
    const accountBelongsToUser = user.accounts
      .map(a => a.id).includes(query.accountID);
    if (!accountBelongsToUser) {
      throw new UnauthorizedException('Unauthorized action');
    }

    const data = await this.tradeRepo.createQueryBuilder('TR')
      .leftJoinAndSelect('TR.account', 'A')
      .select('SUM(TR.profitOrLoss)', 'total')
      .where('A.id = :accountID', { accountID: query.accountID })
      .andWhere('TR.status = :status', { status: query.status })
      .andWhere('TR.assetType = :assetType', { assetType: query.assetType })
      .getRawOne();
    return data?.total;
  }

  async fetchTotalActiveBid(query: FindTradeAmountsQueryParams, user: User) {
    const accountBelongsToUser = user.accounts
      .map(a => a.id).includes(query.accountID);
    if (!accountBelongsToUser) {
      throw new UnauthorizedException('Unauthorized action');
    }

    const data = await this.tradeRepo.createQueryBuilder('TR')
      .leftJoinAndSelect('TR.account', 'A')
      .select('SUM(TR.bidAmount)', 'total')
      .where('A.id = :accountID', { accountID: query.accountID })
      .andWhere('TR.status = :status', { status: query.status })
      .andWhere('TR.assetType = :assetType', { assetType: query.assetType })
      .getRawOne();
    return data?.total;
  }

	findOne(id: string) {
		return this.tradeRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
	}

	async update(id: string, updateTrade: UpdateTrade) {
    const trade = await this.findOne(id);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.executeTransaction(async (queryRunner) => {
      if (updateTrade.status === TradeStatus.cancelled && trade.status !== TradeStatus.cancelled) {
        await this.accountService.increaseBalance(trade.account.id, trade.bidAmount, queryRunner);
        await this.transactionService.update(
          trade.id,
          { status: (TransactionStatusEnum.cancelled as unknown) as TransactionStatus },
          queryRunner
        );
      } else if (updateTrade.status === TradeStatus.closed && trade.status !== TradeStatus.closed) {
        const currentPrice = updateTrade.currentPrice || null;
        await this.checkAndCloseTrade(trade, true, currentPrice);
      } else if (updateTrade.takeProfit || updateTrade.stopLoss) {
        if (
          updateTrade.takeProfit &&
          ((trade.isShort && +trade.currentPrice <= +updateTrade.takeProfit) ||
            (!trade.isShort && +trade.currentPrice >= +updateTrade.takeProfit))
        ) {
          throw new BadRequestException('Please input a valid take profit parameter');
        }
        if (
          updateTrade.stopLoss &&
          ((trade.isShort && +trade.currentPrice >= +updateTrade.stopLoss) ||
            (!trade.isShort && +trade.currentPrice <= +updateTrade.stopLoss))
        ) {
          throw new BadRequestException('Please input a valid stop loss parameter');
        }
      }
      await queryRunner.manager.update(TradeEntity, id, updateTrade);

      return this.findOne(id);
    });
  }

	remove(id: string) {
		return this.tradeRepo.delete(id);
	}
}

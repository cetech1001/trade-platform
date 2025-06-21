import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeEntity } from './entities/trade.entity';
import { Repository } from 'typeorm';
import { TradeAssetService } from '../trade-asset/trade-asset.service';
import {
  CreateTrade, FindTradeAmountsQueryParams,
  FindTradesQueryParams, Trade, TradeAsset, TradeAssetType, TradeClosureReason,
  TradeStatus,
  TransactionStatus,
  TransactionStatusEnum,
  TransactionType,
  UpdateTrade, User, UserRole
} from '@coinvant/types';
import { paginate } from 'nestjs-typeorm-paginate';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from '../account/account.service';
import { EmailService } from '../email/email.service';
import { environment } from '../../environments/environment';
import { calculatePL, fetchAssetRate, getSymbol, getUnits } from './helpers';
import { UserService } from '../user/user.service';
import { DBTransactionService } from '../common/db-transaction.service';
import { DecimalHelper } from '../../helpers/decimal';

@Injectable()
export class TradeService {
  private logger: Logger = new Logger(TradeService.name);

  constructor(
    @InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>,
    private readonly dbTransactionService: DBTransactionService,
    private readonly tradeAssetService: TradeAssetService,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
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

  private validateAndNormalizeNumber(value: any, fieldName: string): number {
    try {
      const num = DecimalHelper.normalize(value);
      if (DecimalHelper.isLessThan(num, 0) || DecimalHelper.isEqual(num, 0)) {
        throw new BadRequestException(`Invalid ${fieldName}: ${value}`);
      }
      return num;
    } catch (error) {
      throw new BadRequestException(`Invalid ${fieldName}: ${value}`);
    }
  }

  async checkAndCloseTrade(trade: Trade, forceClose?: boolean, currentPrice?: number) {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const symbol = getSymbol(trade.asset);

      if (!currentPrice) {
        currentPrice = await fetchAssetRate(trade.assetType, symbol);
      }

      // Validate current price
      currentPrice = this.validateAndNormalizeNumber(currentPrice, 'currentPrice');

      let profitOrLoss: number;
      let shouldClose = false;
      let reason: TradeClosureReason;
      let closingPrice = currentPrice;

      if (forceClose) {
        shouldClose = true;
        reason = TradeClosureReason.user;
        profitOrLoss = await calculatePL(trade, currentPrice);
      } else if (trade.takeProfit) {
        const takeProfit = DecimalHelper.normalize(trade.takeProfit);
        if ((trade.isShort && DecimalHelper.isLessThan(currentPrice, takeProfit) || DecimalHelper.isEqual(currentPrice, takeProfit)) ||
          (!trade.isShort && DecimalHelper.isGreaterThan(currentPrice, takeProfit) || DecimalHelper.isEqual(currentPrice, takeProfit))) {
          shouldClose = true;
          reason = TradeClosureReason.takeProfit;
          closingPrice = takeProfit;
          profitOrLoss = await calculatePL(trade, takeProfit);
        }
      } else if (trade.stopLoss) {
        const stopLoss = DecimalHelper.normalize(trade.stopLoss);
        if ((trade.isShort && DecimalHelper.isGreaterThan(currentPrice, stopLoss) || DecimalHelper.isEqual(currentPrice, stopLoss)) ||
          (!trade.isShort && DecimalHelper.isLessThan(currentPrice, stopLoss) || DecimalHelper.isEqual(currentPrice, stopLoss))) {
          shouldClose = true;
          reason = TradeClosureReason.stopLoss;
          closingPrice = stopLoss;
          profitOrLoss = await calculatePL(trade, stopLoss);
        }
      }

      if (!shouldClose) {
        profitOrLoss = await calculatePL(trade, currentPrice);
        const bidAmount = DecimalHelper.normalize(trade.bidAmount);
        const totalValue = DecimalHelper.add(bidAmount, profitOrLoss);

        if (DecimalHelper.isLessThan(totalValue, 0) || DecimalHelper.isEqual(totalValue, 0)) {
          shouldClose = true;
          reason = TradeClosureReason.stopOut;
          profitOrLoss = DecimalHelper.multiply(bidAmount, -1);
        }
      }

      // Normalize all numeric values
      profitOrLoss = DecimalHelper.normalize(profitOrLoss);
      const bidAmount = DecimalHelper.normalize(trade.bidAmount);

      if (!shouldClose) {
        await queryRunner.manager.update(TradeEntity, trade.id, {
          profitOrLoss,
          currentPrice,
        });
      } else {
        // Validate closing price before update
        if (DecimalHelper.isLessThan(closingPrice, 0) || DecimalHelper.isEqual(closingPrice, 0)) {
          throw new BadRequestException(`Invalid closing price: ${closingPrice}`);
        }

        const finalBalance = DecimalHelper.add(bidAmount, profitOrLoss);

        await this.accountService.increaseBalance(
          trade.account.id,
          finalBalance,
          queryRunner
        );

        const updateData = {
          profitOrLoss,
          currentPrice: closingPrice,
          closedAt: new Date().toISOString(),
          buyPrice: trade.isShort ? closingPrice : (trade.buyPrice || closingPrice),
          sellPrice: trade.isShort ? (trade.sellPrice || closingPrice) : closingPrice,
          closureReason: reason,
          status: TradeStatus.closed,
        };

        // Validate all prices before update
        if (DecimalHelper.isLessThan(updateData.buyPrice, 0) || DecimalHelper.isEqual(updateData.buyPrice, 0) ||
          DecimalHelper.isLessThan(updateData.sellPrice, 0) || DecimalHelper.isEqual(updateData.sellPrice, 0)) {
          throw new BadRequestException('Invalid buy/sell price calculated');
        }

        await queryRunner.manager.update(TradeEntity, trade.id, updateData);

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
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const account = await this.accountService.findOne(createTrade.accountID);

      const bidAmount = this.validateAndNormalizeNumber(createTrade.bidAmount, 'bidAmount');
      const walletBalance = DecimalHelper.normalize(account.walletBalance);

      if (DecimalHelper.isLessThan(walletBalance, bidAmount)) {
        throw new BadRequestException('Insufficient funds');
      }

      const asset = await this.tradeAssetService.findAsset(createTrade.assetID, createTrade.assetType);

      const obj: any = {
        ...createTrade,
        bidAmount, // Use validated amount
        ...this.getAssetObject(createTrade.assetType, asset),
        account,
      };

      if (createTrade.openingPrice || createTrade.executeAt) {
        if (createTrade.openingPrice) {
          const openingPrice = this.validateAndNormalizeNumber(createTrade.openingPrice, 'openingPrice');
          if (createTrade.isShort) {
            obj['sellPrice'] = openingPrice;
          } else {
            obj['buyPrice'] = openingPrice;
          }
        }
        obj['status'] = TradeStatus.pending;
      } else {
        const openingPrice = await fetchAssetRate(createTrade.assetType, getSymbol(asset));
        const validatedOpeningPrice = this.validateAndNormalizeNumber(openingPrice, 'openingPrice');

        obj['currentPrice'] = validatedOpeningPrice;
        obj['units'] = await getUnits(
          createTrade.assetType,
          validatedOpeningPrice,
          bidAmount,
          createTrade.leverage || 1,
          asset.symbol
        );

        if (createTrade.isShort) {
          obj['sellPrice'] = validatedOpeningPrice;
        } else {
          obj['buyPrice'] = validatedOpeningPrice;
        }
        obj['status'] = TradeStatus.active;
        obj['executeAt'] = new Date().toISOString();
      }

      const trade = await queryRunner.manager.save(TradeEntity, obj);

      await this.transactionService.create({
        type: TransactionType.trade,
        account,
        status: obj['status'],
        amount: bidAmount,
        transactionID: trade.id,
      }, queryRunner);

      await this.accountService.decreaseBalance(account.id, bidAmount, queryRunner);

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
          amount: bidAmount.toString(),
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
    return DecimalHelper.normalize(data?.total || 0);
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
    return DecimalHelper.normalize(data?.total || 0);
  }

  findOne(id: string) {
    return this.tradeRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
  }

  async update(id: string, updateTrade: UpdateTrade) {
    const trade = await this.findOne(id);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (updateTrade.openingPrice) {
      const openingPrice = this.validateAndNormalizeNumber(updateTrade.openingPrice, 'openingPrice');
      if (trade.isShort) {
        updateTrade.sellPrice = openingPrice;
      } else {
        updateTrade.buyPrice = openingPrice;
      }
      const bidAmount = DecimalHelper.normalize(trade.bidAmount);
      const leverage = DecimalHelper.normalize(trade.leverage);
      updateTrade.units = DecimalHelper.divide(DecimalHelper.multiply(bidAmount, leverage), openingPrice);
      delete updateTrade.openingPrice;
    }

    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
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
        const currentPrice = DecimalHelper.normalize(trade.currentPrice);

        if (updateTrade.takeProfit) {
          const takeProfit = DecimalHelper.normalize(updateTrade.takeProfit);
          if ((trade.isShort && DecimalHelper.isLessThan(currentPrice, takeProfit) || DecimalHelper.isEqual(currentPrice, takeProfit)) ||
            (!trade.isShort && DecimalHelper.isGreaterThan(currentPrice, takeProfit) || DecimalHelper.isEqual(currentPrice, takeProfit))) {
            throw new BadRequestException('Please input a valid take profit parameter');
          }
        }

        if (updateTrade.stopLoss) {
          const stopLoss = DecimalHelper.normalize(updateTrade.stopLoss);
          if ((trade.isShort && DecimalHelper.isGreaterThan(currentPrice, stopLoss) || DecimalHelper.isEqual(currentPrice, stopLoss)) ||
            (!trade.isShort && DecimalHelper.isLessThan(currentPrice, stopLoss) || DecimalHelper.isEqual(currentPrice, stopLoss))) {
            throw new BadRequestException('Please input a valid stop loss parameter');
          }
        }
      }

      await queryRunner.manager.update(TradeEntity, id, updateTrade);

      return {
        ...trade,
        ...updateTrade,
      };
    });
  }

  remove(id: string) {
    return this.tradeRepo.delete(id);
  }
}

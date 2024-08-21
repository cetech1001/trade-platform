import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {Repository} from "typeorm";
import {TradeAssetService} from "../trade-asset/trade-asset.service";
import {
  CreateTrade,
  FindTradeQueryParams,
  Trade,
  TradeAssetType,
  UpdateTrade,
  User
} from "@coinvant/types";
import {paginate} from "nestjs-typeorm-paginate";
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class TradeService {
  constructor(
      @InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>,
      private readonly tradeAssetService: TradeAssetService,
  ) {}

  create(createTrade: CreateTrade, user: User) {
    let obj: any = {
      ...createTrade,
      user
    };
    const asset = this.tradeAssetService.findAsset(createTrade.assetID, createTrade.assetType);
    if (asset) {
      switch (createTrade.assetType) {
        case TradeAssetType.stocks:
          obj = {
            ...obj,
            stock: asset,
          };
          break;
        case TradeAssetType.forex:
          obj = {
            ...obj,
            forex: asset,
          };
          break;
        default:
          obj = {
            ...createTrade,
            crypto: asset,
          }
      }
    } else {
      throw new NotFoundException('Asset not found');
    }

    return this.tradeRepo.save(obj);
  }

  findAll(query: FindTradeQueryParams) {
    const { status, assetType, ...options } = query;
    const queryBuilder = this.tradeRepo.createQueryBuilder('T');
    if (status) {
      queryBuilder.andWhere('T.status = :status', { status });
    }
    if (assetType) {
      queryBuilder.andWhere('T.assetType = :assetType', { assetType });
    }
    return paginate(queryBuilder, options);
  }

  findOne(id: string) {
    return this.tradeRepo.findOne({ where: { id } });
  }

  update(id: string, updateTrade: UpdateTrade) {
    return this.tradeRepo.update(id, updateTrade);
  }

  remove(id: string) {
    return this.tradeRepo.delete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkTrades() {
    const openTrades = await this.tradeRepo.find({
      where: { isExecuted: false },
    });

    for (const trade of openTrades) {
      let asset;
      if (trade.assetType === TradeAssetType.stocks) {
        asset = trade.stock;
      } else if (trade.assetType === TradeAssetType.forex) {
        asset = trade.forex;
      } else {
        asset = trade.crypto;
      }

      const currentPrice = await this.getCurrentAssetPrice(asset);

      if (this.shouldExecuteTrade(trade, currentPrice)) {
        await this.executeTrade(trade, currentPrice);
      }
    }
  }

  private async getCurrentAssetPrice(symbol: string): Promise<number> {
    return Math.random() * 100;
  }

  private shouldExecuteTrade(trade: Trade, currentPrice: number): boolean {
    if (trade.takeProfit && currentPrice >= trade.takeProfit && !trade.isShort) {
      return true;
    }

    if (trade.takeProfit && currentPrice <= trade.takeProfit && trade.isShort) {
      return true;
    }

    if (trade.stopLoss && currentPrice <= trade.stopLoss && !trade.isShort) {
      return true;
    }

    if (trade.stopLoss && currentPrice >= trade.stopLoss && trade.isShort) {
      return true;
    }

    if (trade.targetPrice && trade.targetPrice <= currentPrice && !trade.isShort) {
      return true;
    }

    if (trade.targetPrice && trade.targetPrice >= currentPrice && trade.isShort) {
      return true;
    }

    return trade.executeAt && new Date() >= trade.executeAt;
  }

  private async executeTrade(trade: Trade, currentPrice: number) {
    trade.isExecuted = true;

    const profitOrLoss = this.calculateProfitOrLoss(trade.bidAmount, trade.multiplier, trade.targetPrice, currentPrice, trade.isShort);

    // Assuming a simplistic model where the profit/loss is simply logged
    console.log(`Trade ${trade.id} executed at ${currentPrice}. Profit/Loss: ${profitOrLoss}`);

    await this.tradeRepo.save(trade);
  }

  private calculateProfitOrLoss(bidAmount: number, multiplier: number, targetPrice: number, executionPrice: number, isShort: boolean): number {
    let priceMovement: number;
    if (isShort) {
      priceMovement = targetPrice - executionPrice;
    } else {
      priceMovement = executionPrice - targetPrice;
    }
    return bidAmount * multiplier * priceMovement;
  }
}

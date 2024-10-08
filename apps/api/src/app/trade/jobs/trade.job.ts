import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TradeStatus } from '@coinvant/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeEntity } from '../entities/trade.entity';
import {
  getCurrentAssetPrice,
  getUnits,
  shouldOpenTrade
} from '../helpers';
import { TradeService } from '../trade.service';

@Injectable()
export class TradeJob {
  constructor(
    @InjectRepository(TradeEntity) private readonly tradeRepo: Repository<TradeEntity>,
    private readonly tradeService: TradeService) {
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPendingTrades() {
    const pendingTrades = await this.tradeRepo.find({
      where: { status: TradeStatus.pending }
    });

    for (const trade of pendingTrades) {
      // @ts-expect-error idk
      const currentPrice = await getCurrentAssetPrice(trade.assetType, trade.asset.currencyID || trade.asset.symbol);
      const shouldOpen = await shouldOpenTrade(trade, currentPrice);
      if (shouldOpen) {
        const obj = { status: TradeStatus.active, currentPrice };
        if (!trade.buyPrice && !trade.sellPrice) {
          if (trade.isShort) {
            obj['sellPrice'] = currentPrice;
          } else {
            obj['buyPrice'] = currentPrice;
          }
        }
        if (!trade.executeAt) {
          obj['executeAt'] = new Date().toDateString();
        }
        const openingPrice = trade.buyPrice || trade.sellPrice || obj['buyPrice'] || obj['sellPrice'];
        obj['units'] = await getUnits(trade.assetType, openingPrice, trade.bidAmount, trade.leverage, trade.asset.symbol);
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
      await this.tradeService.checkAndCloseTrade(trade);
    }
  }
}

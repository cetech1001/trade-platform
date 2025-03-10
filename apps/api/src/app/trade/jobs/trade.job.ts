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
    const tradeMap = new Map<string, number>();

    const pendingTrades = await this.tradeRepo.find({
      where: { status: TradeStatus.pending }
    });

    for (const trade of pendingTrades) {
      // @ts-expect-error idk
      const symbol = trade.asset.currencyID || trade.asset.symbol;
      let currentPrice = tradeMap.get(symbol);
      if (!currentPrice) {
        currentPrice = await getCurrentAssetPrice(trade.assetType, symbol);
        tradeMap.set(symbol, currentPrice);
      }
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
        obj['units'] = await getUnits(trade.assetType, openingPrice, trade.bidAmount, trade.leverage, symbol);
        await this.tradeRepo.update(trade.id, obj);
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkActiveTrades() {
    const openTrades = await this.tradeRepo.find({
      where: { status: TradeStatus.active },
    });
    const tradePriceMap = new Map<string, number>();

    for (const trade of openTrades) {
      // @ts-expect-error idk
      const symbol = trade.asset.currencyID || trade.asset.symbol;
      if (symbol === "XAU/USD") {
        continue;
      }
      let currentPrice = tradePriceMap.get(symbol);
      if (!currentPrice) {
        currentPrice = await getCurrentAssetPrice(trade.assetType, symbol);
        tradePriceMap.set(symbol, currentPrice);
      }
      await this.tradeService.checkAndCloseTrade(trade, false, currentPrice);
    }
  }
}

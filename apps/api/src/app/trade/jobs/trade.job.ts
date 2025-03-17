import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CryptoCurrency, TradeAssetType, TradeStatus } from '@coinvant/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeEntity } from '../entities/trade.entity';
import { fetchAssetRate, getSymbol, getUnits, shouldOpenTrade } from '../helpers';
import { TradeService } from '../trade.service';

@Injectable()
export class TradeJob {
  private logger: Logger = new Logger(TradeJob.name);
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
      try {
        const symbol = trade.assetType === TradeAssetType.crypto
          ? (trade.asset as CryptoCurrency).currencyID : trade.asset.symbol;
        let currentPrice = tradeMap.get(symbol);
        if (!currentPrice) {
          currentPrice = await fetchAssetRate(trade.assetType, symbol);
          tradeMap.set(symbol, currentPrice);
        }
        const shouldOpen = await shouldOpenTrade(trade, currentPrice);
        if (shouldOpen) {
          const obj: any = { status: TradeStatus.active, currentPrice };
          if (!trade.buyPrice && !trade.sellPrice) {
            if (trade.isShort) {
              obj['sellPrice'] = currentPrice;
            } else {
              obj['buyPrice'] = currentPrice;
            }
          }
          if (!trade.executeAt) {
            obj['executeAt'] = new Date().toISOString();
          }
          const openingPrice = trade.buyPrice || trade.sellPrice || obj['buyPrice'] || obj['sellPrice'];
          obj['units'] = await getUnits(trade.assetType, openingPrice, trade.bidAmount, trade.leverage, symbol);
          await this.tradeRepo.update(trade.id, obj);
        }
      } catch (error) {
        this.logger.error(`Error processing pending trade ${trade.id} (${trade.asset.symbol}):`, error);
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
      try {
        const symbol = getSymbol(trade.asset);
        let currentPrice = tradePriceMap.get(symbol);
        if (!currentPrice) {
          currentPrice = await fetchAssetRate(trade.assetType, symbol);
          tradePriceMap.set(symbol, currentPrice);
        }
        await this.tradeService.checkAndCloseTrade(trade, false, currentPrice);
      } catch (error) {
        this.logger.error(`Error processing active trade ${trade.id} (${trade.asset.symbol}):`, error);
      }
    }
  }
}

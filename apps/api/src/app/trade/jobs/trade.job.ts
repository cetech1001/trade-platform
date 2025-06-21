import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CryptoCurrency, TradeAssetType, TradeStatus } from '@coinvant/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeEntity } from '../entities/trade.entity';
import { fetchAssetRate, getSymbol, getUnits, shouldOpenTrade } from '../helpers';
import { TradeService } from '../trade.service';
import { DecimalHelper } from '../../../helpers/decimal';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}

@Injectable()
export class TradeJob {
  private logger: Logger = new Logger(TradeJob.name);
  private processingTrades = new Set<string>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 300000; // 5 minutes

  constructor(
    @InjectRepository(TradeEntity) private readonly tradeRepo: Repository<TradeEntity>,
    private readonly tradeService: TradeService) {
  }

  private async lockTrade(tradeId: string): Promise<boolean> {
    if (this.processingTrades.has(tradeId)) {
      return false;
    }
    this.processingTrades.add(tradeId);
    return true;
  }

  private unlockTrade(tradeId: string): void {
    this.processingTrades.delete(tradeId);
  }

  private isCircuitBreakerOpen(symbol: string): boolean {
    const breaker = this.circuitBreakers.get(symbol);
    if (!breaker) return false;

    const now = Date.now();
    if (breaker.isOpen && (now - breaker.lastFailureTime) > this.CIRCUIT_BREAKER_TIMEOUT) {
      // Reset circuit breaker after timeout
      this.circuitBreakers.set(symbol, {
        failures: 0,
        lastFailureTime: 0,
        isOpen: false
      });
      return false;
    }

    return breaker.isOpen;
  }

  private recordFailure(symbol: string): void {
    const breaker = this.circuitBreakers.get(symbol) || {
      failures: 0,
      lastFailureTime: 0,
      isOpen: false
    };

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      breaker.isOpen = true;
      this.logger.warn(`Circuit breaker opened for ${symbol} after ${breaker.failures} failures`);
    }

    this.circuitBreakers.set(symbol, breaker);
  }

  private recordSuccess(symbol: string): void {
    const breaker = this.circuitBreakers.get(symbol);
    if (breaker) {
      breaker.failures = Math.max(0, breaker.failures - 1);
      this.circuitBreakers.set(symbol, breaker);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPendingTrades() {
    try {
      const pendingTrades = await this.tradeRepo.find({
        where: { status: TradeStatus.pending }
      });

      const errors: string[] = [];

      for (const trade of pendingTrades) {
        if (!await this.lockTrade(trade.id)) {
          continue;
        }

        try {
          const symbol = trade.assetType === TradeAssetType.crypto
            ? (trade.asset as CryptoCurrency).currencyID : trade.asset.symbol;

          // Check circuit breaker
          if (this.isCircuitBreakerOpen(symbol)) {
            this.logger.debug(`Skipping ${symbol} - circuit breaker is open`);
            continue;
          }

          // Rate limiting is now handled in the individual helpers
          let currentPrice: number;
          try {
            currentPrice = await fetchAssetRate(trade.assetType, symbol);
            this.recordSuccess(symbol);
          } catch (error) {
            this.recordFailure(symbol);
            throw error;
          }

          const shouldOpen = await shouldOpenTrade(trade, currentPrice);
          if (shouldOpen) {
            const updateData: any = {
              status: TradeStatus.active,
              currentPrice: currentPrice
            };

            if (!trade.buyPrice && !trade.sellPrice) {
              if (trade.isShort) {
                updateData.sellPrice = currentPrice;
              } else {
                updateData.buyPrice = currentPrice;
              }
            }

            if (!trade.executeAt) {
              updateData.executeAt = new Date().toISOString();
            }

            const openingPrice = DecimalHelper.normalize(
              trade.buyPrice || trade.sellPrice ||
              updateData.buyPrice || updateData.sellPrice
            );

            if (DecimalHelper.isLessThan(openingPrice, 0) || DecimalHelper.isEqual(openingPrice, 0)) {
              throw new Error(`Invalid opening price calculated: ${openingPrice}`);
            }

            const bidAmount = DecimalHelper.normalize(trade.bidAmount);
            const leverage = DecimalHelper.normalize(trade.leverage);

            updateData.units = await getUnits(
              trade.assetType,
              openingPrice,
              bidAmount,
              leverage,
              symbol
            );

            await this.tradeRepo.update(trade.id, updateData);
            this.logger.debug(`Opened trade ${trade.id} at price ${currentPrice}`);
          }
        } catch (error) {
          errors.push(`Trade ${trade.id} (${trade.asset?.symbol || 'unknown'}): ${error.message}`);
          this.logger.error(`Error processing pending trade ${trade.id}:`, error);
        } finally {
          this.unlockTrade(trade.id);
        }
      }

      if (errors.length > 0) {
        this.logger.warn(`Pending trades check completed with ${errors.length} errors`);
      }
    } catch (error) {
      this.logger.error('Critical error in checkPendingTrades:', error);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkActiveTrades() {
    try {
      const openTrades = await this.tradeRepo.find({
        where: { status: TradeStatus.active },
      });
      const errors: string[] = [];

      for (const trade of openTrades) {
        if (!await this.lockTrade(trade.id)) {
          continue;
        }

        try {
          const symbol = getSymbol(trade.asset);

          // Check circuit breaker
          if (this.isCircuitBreakerOpen(symbol)) {
            this.logger.debug(`Skipping ${symbol} - circuit breaker is open`);
            continue;
          }

          // Rate limiting is now handled in the individual helpers
          let currentPrice: number;
          try {
            currentPrice = await fetchAssetRate(trade.assetType, symbol);
            this.recordSuccess(symbol);
          } catch (error) {
            this.recordFailure(symbol);
            throw error;
          }

          await this.tradeService.checkAndCloseTrade(trade, false, currentPrice);
        } catch (error) {
          errors.push(`Trade ${trade.id} (${trade.asset?.symbol || 'unknown'}): ${error.message}`);
          this.logger.error(`Error processing active trade ${trade.id}:`, error);
        } finally {
          this.unlockTrade(trade.id);
        }
      }

      if (errors.length > 0) {
        this.logger.warn(`Active trades check completed with ${errors.length} errors`);
      }
    } catch (error) {
      this.logger.error('Critical error in checkActiveTrades:', error);
    }
  }

  // Cleanup job to reset stuck trades
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupStuckTrades() {
    try {
      // Find trades that have been processing for too long
      const stuckTradeIds = Array.from(this.processingTrades);
      if (stuckTradeIds.length > 0) {
        this.logger.warn(`Cleaning up ${stuckTradeIds.length} stuck trades`);
        this.processingTrades.clear();
      }

      // Reset circuit breakers that have been open too long
      const now = Date.now();
      for (const [symbol, breaker] of this.circuitBreakers.entries()) {
        if (breaker.isOpen && (now - breaker.lastFailureTime) > this.CIRCUIT_BREAKER_TIMEOUT * 2) {
          this.logger.verbose(`Force resetting circuit breaker for ${symbol}`);
          this.circuitBreakers.delete(symbol);
        }
      }
    } catch (error) {
      this.logger.error('Error in cleanup job:', error);
    }
  }
}

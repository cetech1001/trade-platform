import { CryptoCurrency, Trade, TradeAsset, TradeAssetType } from '@coinvant/types';
import { calculateStockPL, fetchStockRate } from './stock.helper';
import { calculateCryptoPL, fetchCryptoRate } from './crypto.helper';
import { calculateForexPL, fetchForexRate } from './forex.helper';

const rateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

const cleanupRateCache = () => {
  const now = Date.now();
  for (const [key, { timestamp }] of rateCache.entries()) {
    if (now - timestamp >= CACHE_DURATION_MS) {
      rateCache.delete(key);
    }
  }
};

setInterval(cleanupRateCache, CACHE_DURATION_MS);

export async function fetchAssetRate(assetType: TradeAssetType, symbol: string): Promise<number> {
  try {
    const cacheKey = symbol;
    const now = Date.now();

    if (rateCache.has(cacheKey)) {
      const cached = rateCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION_MS) {
        return cached.rate;
      }
    }

    let rate: number;

    if (assetType === TradeAssetType.stock) {
      rate = await fetchStockRate(symbol);
    } else if (assetType === TradeAssetType.crypto) {
      rate = await fetchCryptoRate(symbol);
    } else {
      rate = await fetchForexRate(symbol);
    }

    rateCache.set(cacheKey, { rate, timestamp: now });
    return rate;
  } catch (error) {
    console.error(`Error fetching asset rate for ${symbol}: ${error.message}`);
    throw error;
  }
}

export async function shouldOpenTrade(trade: Trade, currentPrice: number) {
  if (trade.executeAt && new Date() >= new Date(trade.executeAt)) {
    return true;
  } else if (trade.sellPrice && trade.sellPrice >= currentPrice) {
    return true
  }
  return trade.buyPrice && trade.buyPrice <= currentPrice;
}

export function calculatePL(trade: Trade, currentPrice: number): number | Promise<number> {
  if (trade.assetType === TradeAssetType.stock) {
    return calculateStockPL(trade, currentPrice);
  } else if (trade.assetType === TradeAssetType.crypto) {
    return calculateCryptoPL(trade, currentPrice);
  }
  return calculateForexPL(trade, currentPrice);
}

export async function getUnits(
  assetType: TradeAssetType,
  currentPrice: number,
  bidAmount: number,
  leverage = 1,
  symbol?: string) {
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
  const rate = await fetchForexRate(`${base}/USD`);
  return bidAmount * leverage / rate;
}

export const getSymbol = (asset: TradeAsset) => {
  if ((asset as CryptoCurrency).currencyID) {
    return (asset as CryptoCurrency).currencyID;
  }
  return asset.symbol;
}

import { CryptoCurrency, Trade, TradeAsset, TradeAssetType } from '@coinvant/types';
import { calculateStockPL, fetchStockRate } from './stock.helper';
import { calculateCryptoPL, fetchCryptoRate } from './crypto.helper';
import { calculateForexPL, fetchForexRate } from './forex.helper';
import { DecimalHelper } from '../../../helpers/decimal';

export async function fetchAssetRate(assetType: TradeAssetType, symbol: string): Promise<number> {
  try {
    let rate: number;

    if (assetType === TradeAssetType.stock) {
      rate = await fetchStockRate(symbol);
    } else if (assetType === TradeAssetType.crypto) {
      rate = await fetchCryptoRate(symbol);
    } else {
      rate = await fetchForexRate(symbol);
    }

    return DecimalHelper.normalize(rate);
  } catch (error) {
    console.error(`Error fetching asset rate for ${symbol}: ${error.message}`);
    throw error;
  }
}

export async function shouldOpenTrade(trade: Trade, currentPrice: number) {
  const normalizedCurrentPrice = DecimalHelper.normalize(currentPrice);

  if (trade.executeAt && new Date() >= new Date(trade.executeAt)) {
    return true;
  } else if (trade.sellPrice) {
    const sellPrice = DecimalHelper.normalize(trade.sellPrice);
    return DecimalHelper.isGreaterThan(sellPrice, normalizedCurrentPrice) ||
      DecimalHelper.isEqual(sellPrice, normalizedCurrentPrice);
  }

  if (trade.buyPrice) {
    const buyPrice = DecimalHelper.normalize(trade.buyPrice);
    return DecimalHelper.isLessThan(buyPrice, normalizedCurrentPrice) ||
      DecimalHelper.isEqual(buyPrice, normalizedCurrentPrice);
  }

  return false;
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
  symbol?: string
): Promise<number> {
  const normalizedCurrentPrice = DecimalHelper.normalize(currentPrice);
  const normalizedBidAmount = DecimalHelper.normalize(bidAmount);
  const normalizedLeverage = DecimalHelper.normalize(leverage);

  const leveragedAmount = DecimalHelper.multiply(normalizedBidAmount, normalizedLeverage);

  if (assetType === TradeAssetType.stock || assetType === TradeAssetType.crypto) {
    return DecimalHelper.divide(leveragedAmount, normalizedCurrentPrice);
  }

  // For forex pairs
  const [base, term] = symbol.split('/');
  if (base === 'USD') {
    return leveragedAmount;
  } else if (term === 'USD') {
    return DecimalHelper.divide(leveragedAmount, normalizedCurrentPrice);
  }

  const rate = await fetchForexRate(`${base}/USD`);
  const normalizedRate = DecimalHelper.normalize(rate);
  return DecimalHelper.divide(leveragedAmount, normalizedRate);
}

export const getSymbol = (asset: TradeAsset) => {
  if ((asset as CryptoCurrency).currencyID) {
    return (asset as CryptoCurrency).currencyID;
  }
  return asset.symbol;
}

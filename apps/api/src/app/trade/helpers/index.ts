import axios from 'axios';
import { Trade, TradeAssetType } from '@coinvant/types';

const getCurrentPriceForStock = async (symbol: string) => {
  const { data } = await axios.get(`https://www.alphavantage.co/query`, {
    params: {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: '5min',
      apikey: '4SSFX5O7DOW5SK3C',
    },
  });

  const timeSeries = data['Time Series (5min)'];
  const latestTime = Object.keys(timeSeries)[0];
  const latestData = timeSeries[latestTime];
  return parseFloat(latestData['1. open']);
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getCurrentPriceForForex = async (symbol: string) => {
  const [base, term] = symbol.split('/');
  try {
    const { data } = await axios.get(`https://api.frankfurter.app/latest?amount=1&from=${base}&to=${term}`);
    return data.rates[term];
  } catch (e) {

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const currentDate = formatDate(today);
    const yesterdayDate = formatDate(yesterday);

    const { data } = await axios.get(`https://api.polygon.io/v2/aggs/ticker/C:${base}${term}/range/1/day/${yesterdayDate}/${currentDate}?adjusted=true&sort=desc&limit=-2&apiKey=GgtbDtQgjKDCbNcyPxwuzAV34QLhjjiS`);
    return data.results[0].c;
  }
}

const getCurrentPriceForCrypto = async (currencyID: string) => {
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyID}`);
  return data[0].current_price;
}

export async function getCurrentAssetPrice(assetType: TradeAssetType, symbol?: string): Promise<number> {
  if (assetType === TradeAssetType.stock) {
  return getCurrentPriceForStock(symbol);
} else if (assetType === TradeAssetType.crypto) {
  return getCurrentPriceForCrypto(symbol);
} else {
  return getCurrentPriceForForex(symbol);
}
}

export async function shouldOpenTrade(trade: Trade, currentPrice: number) {
  if (trade.executeAt && new Date() >= new Date(trade.executeAt)) {
    return true;
  }

  if (trade.sellPrice && trade.sellPrice >= currentPrice) {
    return true
  }

  if (trade.buyPrice && trade.buyPrice <= currentPrice) {
    return true;
  }
}

export function calculatePLForCrypto(trade: Trade, currentPrice: number) {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  return trade.units * trade.leverage * priceMovement;
}

export async function calculatePLForForex(trade: Trade, currentPrice: number) {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  const profitOrLoss = trade.units * priceMovement;
  const [base, term] = trade.asset.symbol.split('/');
  if (base === 'USD') {
    return profitOrLoss / currentPrice;
  } else if (term === 'USD') {
    return profitOrLoss;
  }
  const rate = await getCurrentPriceForForex(`${term}/USD`);
  return profitOrLoss * rate;
}

function calculatePLForStock(trade: Trade, currentPrice: number) {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  return trade.units * priceMovement;
}

export function calculateProfitOrLoss(trade: Trade, currentPrice: number) {
  if (trade.assetType === TradeAssetType.stock) {
    return calculatePLForStock(trade, currentPrice);
  } else if (trade.assetType === TradeAssetType.crypto) {
    return calculatePLForCrypto(trade, currentPrice);
  }
  return calculatePLForForex(trade, currentPrice);
}

export async function getUnits(assetType: TradeAssetType, currentPrice: number, bidAmount: number, leverage = 1, symbol?: string) {
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
  const rate = await getCurrentPriceForForex(`${base}/USD`);
  return bidAmount * leverage / rate;
}

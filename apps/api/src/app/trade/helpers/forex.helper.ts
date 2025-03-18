import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Trade } from '@coinvant/types';

const forexRateCache = new Map<string, { rate: number, timestamp: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000;

const cleanupForexRateCache = () => {
  const now = Date.now();
  for (const [key, { timestamp }] of forexRateCache.entries()) {
    if (now - timestamp >= CACHE_DURATION_MS) {
      forexRateCache.delete(key);
    }
  }
};

setInterval(cleanupForexRateCache, CACHE_DURATION_MS);

export const fetchForexRate = async (symbol: string): Promise<number> => {
  const cached = forexRateCache.get(symbol);
  const now = Date.now();
  if (cached && (now - cached.timestamp) < CACHE_DURATION_MS) {
    return cached.rate;
  }
  const [base, term] = symbol.split('/');
  let rate: number;
  try {
    rate = await fetchRateFromFrankfurter(base, term);
  } catch (primaryError) {
    rate = await fetchRateFromPolygon(base, term);
  }
  forexRateCache.set(symbol, { rate, timestamp: now });
  return rate;
};

const fetchRateFromFrankfurter = async (base: string, term: string): Promise<number> => {
  const { data } = await axios.get(`https://api.frankfurter.app/latest`, {
    params: {
      amount: 1,
      from: base,
      to: term,
    },
  });
  return Number(data.rates[term]);
};

const fetchRateFromPolygon = async (base: string, term: string): Promise<number> => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const currentDate = formatDate(today);
  const yesterdayDate = formatDate(yesterday);

  const { data } = await axios.get(
    `https://api.polygon.io/v2/aggs/ticker/C:${base}${term}/range/1/day/${yesterdayDate}/${currentDate}`, {
      params: {
        adjusted: true,
        sort: 'desc',
        limit: -2,
        apiKey: environment.polygonAPIKey,
      },
    }
  );
  return Number(data.results[0].c);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const convertPLToUSD = async (profitOrLoss: number, currentPrice: number, symbol: string): Promise<number> => {
  const [base, term] = symbol.split('/');
  if (base === 'USD') {
    return profitOrLoss / currentPrice;
  } else if (term === 'USD') {
    return profitOrLoss;
  } else {
    try {
      const rate = await fetchForexRate(`${term}/USD`);
      return profitOrLoss * rate;
    } catch (error) {
      console.error('Error converting profit/loss to USD:', error);
      throw new Error('Currency conversion failed');
    }
  }
};

export const calculateForexPL = async (trade: Trade, currentPrice: number): Promise<number> => {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  const profitOrLoss = trade.units * priceMovement;
  return await convertPLToUSD(profitOrLoss, currentPrice, trade.asset.symbol);
};

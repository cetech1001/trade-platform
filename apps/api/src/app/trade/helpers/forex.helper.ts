import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Trade } from '@coinvant/types';
import { APIRateLimiter } from '../../common/rate-limiter.service';
import { DecimalHelper } from '../../../helpers/decimal';

export const fetchForexRate = async (symbol: string): Promise<number> => {
  const [base, term] = symbol.split('/');
  let rate: number;

  try {
    rate = await fetchRateFromFrankfurter(base, term);
  } catch (primaryError) {
    console.log(`Frankfurter failed for ${symbol}, trying Polygon...`);
    rate = await fetchRateFromPolygon(base, term);
  }

  return DecimalHelper.normalize(rate);
};

const fetchRateFromFrankfurter = async (base: string, term: string): Promise<number> => {
  const rateLimiter = APIRateLimiter.getLimiter('frankfurter');
  const symbol = `${base}/${term}`;

  return await rateLimiter.executeWithCaching(`forex-frankfurter-${base}-${term}`, async () => {
    const { data } = await axios.get(`https://api.frankfurter.app/latest`, {
      params: {
        amount: 1,
        from: base,
        to: term,
      },
      timeout: 10000, // 10 second timeout
    });

    if (!data.rates || !data.rates[term]) {
      throw new Error(`No exchange rate available for ${symbol}`);
    }

    const rate = DecimalHelper.normalize(data.rates[term]);

    if (DecimalHelper.isLessThan(rate, 0) || DecimalHelper.isEqual(rate, 0)) {
      throw new Error(`Invalid exchange rate for ${symbol}: ${rate}`);
    }

    console.log(`Fresh forex rate fetched from Frankfurter for ${symbol}: ${rate}`);
    return rate;
  });
};

const fetchRateFromPolygon = async (base: string, term: string): Promise<number> => {
  const rateLimiter = APIRateLimiter.getLimiter('polygon');
  const symbol = `${base}/${term}`;

  return await rateLimiter.executeWithCaching(`forex-polygon-${base}-${term}`, async () => {
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
        timeout: 10000, // 10 second timeout
      }
    );

    if (!data.results || data.results.length === 0) {
      throw new Error(`No price data available for ${symbol}`);
    }

    const rate = DecimalHelper.normalize(data.results[0].c);

    if (DecimalHelper.isLessThan(rate, 0) || DecimalHelper.isEqual(rate, 0)) {
      throw new Error(`Invalid exchange rate for ${symbol}: ${rate}`);
    }

    console.log(`Fresh forex rate fetched from Polygon for ${symbol}: ${rate}`);
    return rate;
  });
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const convertPLToUSD = async (profitOrLoss: number, currentPrice: number, symbol: string): Promise<number> => {
  const [base, term] = symbol.split('/');
  const normalizedPL = DecimalHelper.normalize(profitOrLoss);
  const normalizedPrice = DecimalHelper.normalize(currentPrice);

  if (base === 'USD') {
    return DecimalHelper.divide(normalizedPL, normalizedPrice);
  } else if (term === 'USD') {
    return normalizedPL;
  } else {
    try {
      const rate = await fetchForexRate(`${term}/USD`);
      return DecimalHelper.multiply(normalizedPL, rate);
    } catch (error) {
      console.error('Error converting profit/loss to USD:', error);
      throw new Error('Currency conversion failed');
    }
  }
};

export const calculateForexPL = async (trade: Trade, currentPrice: number): Promise<number> => {
  // Normalize all inputs using DecimalHelper
  const normalizedCurrentPrice = DecimalHelper.normalize(currentPrice);
  const units = DecimalHelper.normalize(trade.units);

  let priceMovement: number;
  if (trade.isShort) {
    const sellPrice = DecimalHelper.normalize(trade.sellPrice);
    priceMovement = DecimalHelper.subtract(sellPrice, normalizedCurrentPrice);
  } else {
    const buyPrice = DecimalHelper.normalize(trade.buyPrice);
    priceMovement = DecimalHelper.subtract(normalizedCurrentPrice, buyPrice);
  }

  const profitOrLoss = DecimalHelper.multiply(units, priceMovement);
  return await convertPLToUSD(profitOrLoss, normalizedCurrentPrice, trade.asset.symbol);
};

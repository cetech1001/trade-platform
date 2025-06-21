import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Trade } from '@coinvant/types';
import { APIRateLimiter } from '../../common/rate-limiter.service';
import { DecimalHelper } from '../../../helpers/decimal';

export const fetchStockRate = async (symbol: string): Promise<number> => {
  const rateLimiter = APIRateLimiter.getLimiter('alphavantage');

  return await rateLimiter.executeWithCaching(`stock-${symbol}`, async () => {
    const { data } = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: environment.alphaVantageAPIKey,
      },
      timeout: 10000, // 10 second timeout
    });

    // Check for API errors
    if (data['Error Message']) {
      throw new Error(`AlphaVantage API Error: ${data['Error Message']}`);
    }

    if (data['Note']) {
      throw new Error('AlphaVantage API rate limit reached');
    }

    const timeSeries = data['Time Series (5min)'];
    if (!timeSeries) {
      throw new Error(`No time series data available for ${symbol}`);
    }

    const latestTime = Object.keys(timeSeries)[0];
    if (!latestTime) {
      throw new Error(`No price data available for ${symbol}`);
    }

    const latestData = timeSeries[latestTime];
    const price = DecimalHelper.normalize(latestData['1. open']);

    if (DecimalHelper.isLessThan(price, 0) || DecimalHelper.isEqual(price, 0)) {
      throw new Error(`Invalid price data for ${symbol}: ${price}`);
    }

    console.log(`Fresh stock price fetched for ${symbol}: ${price}`);
    return price;
  });
};

export const calculateStockPL = (trade: Trade, currentPrice: number): number => {
  // Validate and normalize inputs using DecimalHelper
  const units = DecimalHelper.normalize(trade.units);
  const normalizedCurrentPrice = DecimalHelper.normalize(currentPrice);

  if (DecimalHelper.isLessThan(units, 0) || DecimalHelper.isEqual(units, 0)) {
    throw new Error('Invalid trade units');
  }

  if (DecimalHelper.isLessThan(normalizedCurrentPrice, 0) || DecimalHelper.isEqual(normalizedCurrentPrice, 0)) {
    throw new Error('Invalid current price');
  }

  if (trade.isShort) {
    const sellPrice = DecimalHelper.normalize(trade.sellPrice);
    if (DecimalHelper.isLessThan(sellPrice, 0) || DecimalHelper.isEqual(sellPrice, 0)) {
      throw new Error('Invalid sell price for short trade');
    }
    const priceMovement = DecimalHelper.subtract(sellPrice, normalizedCurrentPrice);
    return DecimalHelper.multiply(units, priceMovement);
  } else {
    const buyPrice = DecimalHelper.normalize(trade.buyPrice);
    if (DecimalHelper.isLessThan(buyPrice, 0) || DecimalHelper.isEqual(buyPrice, 0)) {
      throw new Error('Invalid buy price for long trade');
    }
    const priceMovement = DecimalHelper.subtract(normalizedCurrentPrice, buyPrice);
    return DecimalHelper.multiply(units, priceMovement);
  }
};

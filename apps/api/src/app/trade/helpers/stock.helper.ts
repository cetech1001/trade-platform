import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Trade } from '@coinvant/types';
import { APIRateLimiter } from '../../common/rate-limiter.service';

export const fetchStockRate = async (symbol: string): Promise<number> => {
  const rateLimiter = APIRateLimiter.getLimiter('alphavantage');

  try {
    return await rateLimiter.executeWithLimit(`stock-${symbol}`, async () => {
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
      const price = parseFloat(latestData['1. open']);

      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price data for ${symbol}: ${price}`);
      }

      return price;
    });
  } catch (error) {
    // If rate limited or API error, try to get from cache or throw
    console.error(`Error fetching stock rate for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch stock price for ${symbol}: ${error.message}`);
  }
};

export const calculateStockPL = (trade: Trade, currentPrice: number): number => {
  // Validate inputs
  if (!trade.units || trade.units <= 0) {
    throw new Error('Invalid trade units');
  }

  if (!currentPrice || currentPrice <= 0) {
    throw new Error('Invalid current price');
  }

  const buyPrice = Number(trade.buyPrice);
  const sellPrice = Number(trade.sellPrice);

  if (trade.isShort) {
    if (!sellPrice || sellPrice <= 0) {
      throw new Error('Invalid sell price for short trade');
    }
    return trade.units * (sellPrice - currentPrice);
  } else {
    if (!buyPrice || buyPrice <= 0) {
      throw new Error('Invalid buy price for long trade');
    }
    return trade.units * (currentPrice - buyPrice);
  }
};

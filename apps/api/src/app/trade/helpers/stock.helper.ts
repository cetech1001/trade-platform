import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Trade } from '@coinvant/types';

export const fetchStockRate = async (symbol: string) => {
  const { data } = await axios.get(`https://www.alphavantage.co/query`, {
    params: {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: '5min',
      apikey: environment.alphaVantageAPIKey,
    },
  });

  const timeSeries = data['Time Series (5min)'];
  const latestTime = Object.keys(timeSeries)[0];
  const latestData = timeSeries[latestTime];
  return parseFloat(latestData['1. open']);
}

export const calculateStockPL = (trade: Trade, currentPrice: number) => {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  return trade.units * priceMovement;
}

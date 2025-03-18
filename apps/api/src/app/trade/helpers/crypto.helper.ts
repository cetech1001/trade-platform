import axios from 'axios';
import { Trade } from '@coinvant/types';

export const fetchCryptoRate = async (currencyID: string) => {
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyID}`);
  return Number(data[0].current_price);
}

export const calculateCryptoPL = (trade: Trade, currentPrice: number) => {
  let priceMovement: number;
  if (trade.isShort) {
    priceMovement = trade.sellPrice - currentPrice;
  } else {
    priceMovement = currentPrice - trade.buyPrice;
  }
  return trade.units * trade.leverage * priceMovement;
}

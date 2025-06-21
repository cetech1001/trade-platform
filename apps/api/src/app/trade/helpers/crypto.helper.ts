import axios from 'axios';
import { Trade } from '@coinvant/types';
import { APIRateLimiter } from '../../common/rate-limiter.service';
import { DecimalHelper } from '../../../helpers/decimal';

export const fetchCryptoRate = async (currencyID: string): Promise<number> => {
  const rateLimiter = APIRateLimiter.getLimiter('coingecko');

  return await rateLimiter.executeWithCaching(`crypto-${currencyID}`, async () => {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyID}`,
      { timeout: 10000 } // 10 second timeout
    );

    if (!data || data.length === 0) {
      throw new Error(`No price data available for ${currencyID}`);
    }

    const price = DecimalHelper.normalize(data[0].current_price);

    if (DecimalHelper.isLessThan(price, 0) || DecimalHelper.isEqual(price, 0)) {
      throw new Error(`Invalid price data for ${currencyID}: ${price}`);
    }

    console.log(`Fresh crypto price fetched for ${currencyID}: ${price}`);
    return price;
  });
}

export const calculateCryptoPL = (trade: Trade, currentPrice: number) => {
  // Validate inputs using DecimalHelper
  const normalizedCurrentPrice = DecimalHelper.normalize(currentPrice);
  const units = DecimalHelper.normalize(trade.units);
  const leverage = DecimalHelper.normalize(trade.leverage);

  let priceMovement: number;
  if (trade.isShort) {
    const sellPrice = DecimalHelper.normalize(trade.sellPrice);
    priceMovement = DecimalHelper.subtract(sellPrice, normalizedCurrentPrice);
  } else {
    const buyPrice = DecimalHelper.normalize(trade.buyPrice);
    priceMovement = DecimalHelper.subtract(normalizedCurrentPrice, buyPrice);
  }

  // Calculate P&L: units * leverage * priceMovement
  const leveragedUnits = DecimalHelper.multiply(units, leverage);
  return DecimalHelper.multiply(leveragedUnits, priceMovement);
}

import {PaginationOptions} from "./pagination";

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface CreateCryptoCurrency extends Omit<CryptoCurrency, 'id'> {}

export interface FindCryptoCurrencies extends PaginationOptions, Partial<Omit<CryptoCurrency, 'id' | 'image'>> {}

export interface ForexPair {
  id: string;
  base: string;
  term: string;
  type: ForexType;
  image?: string;
}

export enum ForexType {
  major = 'Major',
  cross = 'Cross',
  commodity = 'Commodity',
  emergingMarket =  'Emerging Market',
}

export interface CreateForex extends Omit<ForexPair, 'id'> {}

export interface FindForexPairs extends PaginationOptions, Partial<Omit<ForexPair, 'id'>> {}

export interface StockOption {
  id: string;
  symbol: string;
  name: string;
  exchange: StockExchange;
  assetType: StockAssetType;
}

export enum StockExchange {
  NYSE = 'NYSE',
  NYSE_ARCA = 'NYSE ARCA',
  BATS = 'BATS',
  NASDAQ = 'NASDAQ',
  NYSE_MKT = 'NYSE MKT',
}

export enum StockAssetType {
  Stock = 'Stock',
  ETF = 'ETF',
}

export interface CreateStock extends Omit<StockOption, 'id'> {}

export interface FindStockOptions extends PaginationOptions, Partial<Omit<StockOption, 'id'>> {
}

export enum TradeAssetType {
  forex = 'Forex',
  crypto = 'Crypto',
  stocks = 'Stocks',
}

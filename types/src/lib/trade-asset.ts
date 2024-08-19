/*
export enum TradeAssetType {
  forex = 'Forex',
  stock = 'Stock',
}

export enum TradeAssetMarket {
  commodities = 'Commodities',
  composites = 'Composites',
  crypto = 'Crypto',
  currencies = 'Currencies',
  etf = 'ETF',
  indices = 'Indices',
  metals = 'Metals',
  otc = 'OTC',
  stock = 'Stock'
}

export enum TradeAssetCountry {
  europe = 'Europe',
  usa = 'USA',
}

export interface TradeAsset {
  id: string;
  name: string;
  changeRate: number;
  currentPrice: number;
  type: TradeAssetType;
  profitability: number;
  market: TradeAssetMarket;
  country: TradeAssetCountry;
  openingTime?: string;
  closingTime?: string;
  symbol: string;
}
*/
import {PaginationOptions} from "./pagination";

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export interface CreateCrypto extends Omit<CryptoCurrency, 'id'> {}

export interface FindCryptoCurrencies extends PaginationOptions, Omit<CryptoCurrency, 'id' | 'image'> {}

export interface Forex {
  id: string;
  base: string;
  term: string;
  type: ForexType;
}

export enum ForexType {
  major = 'Major',
  cross = 'Cross',
  commodity = 'Commodity',
  emergingMarket =  'Emerging Market',
}

export interface CreateForex extends Omit<Forex, 'id'> {}

export interface FindForexPairs extends PaginationOptions, Omit<Forex, 'id'> {}

export interface Stock {
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

export interface CreateStock extends Omit<Stock, 'id'> {}

export interface FindStockOptions extends PaginationOptions, Omit<Stock, 'id'> {
}

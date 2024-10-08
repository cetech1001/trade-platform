import {PaginationOptions} from "./pagination";

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currencyID: string;
}

export type CreateCryptoCurrency = Omit<CryptoCurrency, 'id'>;

export interface FindCryptoCurrencies extends PaginationOptions, Partial<Omit<CryptoCurrency, 'id' | 'image'>> {}

export interface ForexPair {
  id: string;
  base: string;
  term: string;
  type: ForexType;
  image?: string;
  symbol: string;
}

export enum ForexType {
  major = 'Major',
  cross = 'Cross',
  commodity = 'Commodity',
  emergingMarket =  'Emerging Market',
}

export type CreateForex = Omit<ForexPair, 'id' | 'symbol'>;

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

export type CreateStock = Omit<StockOption, 'id'>;

export interface FindStockOptions extends PaginationOptions, Partial<Omit<StockOption, 'id'>> {
}

export enum TradeAssetType {
  forex = 'forex',
  crypto = 'crypto',
  stock = 'stock',
}

export interface CurrentAsset {
  symbol: string;
  id: string;
  type: TradeAssetType;
  currencyID?: string;
}

export type TradeAsset = StockOption | ForexPair | CryptoCurrency;

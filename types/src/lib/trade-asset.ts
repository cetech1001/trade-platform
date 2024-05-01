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

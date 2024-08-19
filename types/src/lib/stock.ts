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

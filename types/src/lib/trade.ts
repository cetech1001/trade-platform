import {User} from "./user";
import {CryptoCurrency, ForexPair, StockOption, TradeAssetType} from "./trade-asset";
import {PaginationOptions} from "./pagination";

export interface Trade {
	id: string;
	bidAmount: number;
	buyPrice: number;
	sellPrice: number;
	leverage: number;
	units: number;
	profitOrLoss: number;
	isShort: boolean;
	executeAt: string;
	closedAt: string;
	takeProfit?: number;
	stopLoss?: number;
	closureReason?: TradeClosureReason;
	assetType: TradeAssetType;
	status: TradeStatus;
	user: User;
	stock: StockOption;
	forex: ForexPair;
	crypto: CryptoCurrency;
	createdAt: string;
	updatedAt: string;
	asset: ForexPair | CryptoCurrency | StockOption;
}

export enum TradeStatus {
	pending = 'pending',
	active = 'active',
	closed = 'closed',
	cancelled = 'cancelled',
}

export interface CreateTrade
	extends Pick<Trade,
		'bidAmount'
		| 'leverage'
		| 'assetType'
		| 'takeProfit'
		| 'stopLoss'> {
	assetID: string;
	executeAt?: string;
	isShort?: boolean;
	openingPrice?: number;
}

export interface UpdateTrade extends Pick<Trade, 'status'> {}

export interface FindTradeQueryParams extends PaginationOptions, Partial<Pick<Trade, 'status' | 'assetType'>>{
}

export enum TradeClosureReason {
	stopLoss = 'Stop Loss',
	takeProfit = 'Take Profit',
	user = 'User',
	stopOut = 'Stop Out',
}

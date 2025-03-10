import {CryptoCurrency, ForexPair, StockOption, TradeAssetType} from "./trade-asset";
import {PaginationOptions} from "./pagination";
import { Account } from './account';

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
	currentPrice?: number;
	takeProfit?: number;
	stopLoss?: number;
	closureReason?: TradeClosureReason;
	assetType: TradeAssetType;
	status: TradeStatus;
	account: Account;
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
	accountID: string;
	assetID: string;
	executeAt?: string;
	isShort?: boolean;
	openingPrice?: number;
}

export type UpdateTrade = Partial<Pick<Trade, 'status' | 'stopLoss' | 'takeProfit'>>;

export interface FindTradesQueryParams extends PaginationOptions, Partial<Pick<Trade, 'status' | 'assetType'>>{
	accountID?: string;
}

export enum TradeClosureReason {
	stopLoss = 'Stop Loss',
	takeProfit = 'Take Profit',
	user = 'User',
	stopOut = 'Stop Out',
}

export interface TradeState {
	list: Trade[];
	limit: number;
  totalCount: number;
  totalPages: number;
	highlightedTrade: Trade | null;
}

import {User} from "./user";
import {CryptoCurrency, ForexPair, StockOption, TradeAssetType} from "./trade-asset";
import {PaginationOptions} from "./pagination";

export interface Trade {
  id: string;
  bidAmount: number;
  targetPrice?: number;
  multiplier?: number;
  executeAt?: Date;
  isExecuted: boolean;
  takeProfit?: number;
  stopLoss?: number;
  isShort?: boolean;
  assetType: TradeAssetType;
  status: TradeStatus;
  user: User;
  stock: StockOption;
  forex: ForexPair;
  crypto: CryptoCurrency;
  createdAt: string;
  updatedAt: string;
}

export enum TradeStatus {
  pending = 'pending',
  active = 'active',
  completed = 'completed',
  cancelled = 'cancelled',
}

export interface CreateTrade
    extends Pick<Trade,
        'bidAmount'
        | 'targetPrice'
        | 'multiplier'
        | 'executeAt'
        | 'assetType'
        | 'takeProfit'
        | 'stopLoss'
        | 'isShort'> {
  assetID: string;
}

export interface UpdateTrade extends Pick<Trade, 'status'> {}

export interface FindTradeQueryParams extends PaginationOptions, Partial<Pick<Trade, 'status' | 'assetType'>>{
}

import {User} from "./user";

export enum TradeStatus {
  pending = 'pending',
  active = 'active',
  completed = 'completed',
  cancelled = 'cancelled',
}

export interface CreateTrade {
  assetID: string;
  amount: number;
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
  enableByPrice?: number;
  enableByTime?: string;
  duration?: string;
}

export interface UpdateTrade extends Pick<Trade, 'status' | 'upperLimit' | 'lowerLimit'> {
}

export interface Trade extends Omit<CreateTrade, 'assetID'> {
  id: string;
  status: TradeStatus;
  asset: string;
  startTime: string;
  endTime: string;
  upperLimit: number;
  lowerLimit: number;
  user: User;
  createdAt: string;
  updatedAt: string;
}

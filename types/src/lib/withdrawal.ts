import { Account } from './account';
import { PaginationOptions } from './pagination';

export interface Withdrawal {
	id: string;
	amount: number;
	paymentMethod: string;
	network: string;
	walletAddress: string;
	account: Account;
	status: WithdrawalStatus;
	createdAt: string;
	updatedAt: string;
}

export enum WithdrawalStatus {
	pending = 'pending',
	paid = 'paid',
	cancelled = 'cancelled',
}

export interface CreateWithdrawal extends Pick<Withdrawal, 'amount' | 'paymentMethod' | 'walletAddress' | 'network'> {
	accountID: string;
}
export type UpdateWithdrawal = Pick<Withdrawal, 'status'>;

export interface WithdrawalState {
	list: Withdrawal[];
	totalCount: number;
  totalPages: number;
	highlightedWithdrawal: Withdrawal | null;
	totalWithdrawalAmount: number;
}

export interface FindWithdrawalsQueryParams extends PaginationOptions {
	accountID?: string;
}

import {DepositStatus} from "./deposit";
import {WithdrawalStatus} from "./withdrawal";
import {TradeStatus} from "./trade";
import {PaginationOptions} from "./pagination";
import { Account } from './account';

export interface Transaction {
	id: string;
	type: TransactionType;
	transactionID: string;
	amount: number;
	account: Account;
	status: TransactionStatus;
	createdAt: string;
	updatedAt: string;
}

export type CreateTransaction = Pick<Transaction, 'type' | 'amount' | 'transactionID' | 'status' | 'account'>;
export type UpdateTransaction = Pick<Transaction, 'status'>;

export enum TransactionType {
	deposit = 'deposit',
	withdrawal = 'withdrawal',
	trade = 'trade',
}

export type TransactionStatus = DepositStatus | WithdrawalStatus | TradeStatus;

export enum TransactionStatusEnum {
	pending = 'pending',
	confirmed = 'confirmed',
	rejected = 'rejected',
	paid = 'paid',
	cancelled = 'cancelled',
	active = 'active',
	closed = 'closed',

}

export interface TransactionState {
	list: Transaction[];
  highlightedTransaction: Transaction | null;
	totalCount: number;
  totalPages: number;
}

export interface FindTransactionsQueryParams extends PaginationOptions {
	type?: TransactionType;
	status?: TransactionStatus;
	accountID?: string;
}

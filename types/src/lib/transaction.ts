import {User} from "./user";
import {DepositStatus} from "./deposit";
import {WithdrawalStatus} from "./withdrawal";
import {TradeStatus} from "./trade";
import {PaginationOptions} from "./pagination";

export interface Transaction {
	id: string;
	type: TransactionType;
	transactionID: string;
	amount: number;
	user: User;
	status: TransactionStatus;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTransaction extends Pick<Transaction, 'type' | 'amount' | 'transactionID' | 'status' | 'user'> {}
export interface UpdateTransaction extends Pick<Transaction, 'status'> {}

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
	canceled = 'cancelled',
	active = 'active',
	completed = 'completed',

}

export interface TransactionState {
	list: Transaction[];
	count: number;
}

export interface TransactionsQuery extends PaginationOptions {
	type?: TransactionType;
	status?: TransactionStatus;
}

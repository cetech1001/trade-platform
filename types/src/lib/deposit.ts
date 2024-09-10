import { Account } from './account';
import { PaginationOptions } from './pagination';

export interface Deposit {
	id: string;
	amount: number;
	proof: string;
	paymentMethod: string;
	account: Account;
	status: DepositStatus;
	createdAt: string;
	updatedAt: string;
}

export enum DepositStatus {
	pending = 'pending',
	confirmed = 'confirmed',
	rejected = 'rejected',
}

export interface CreateDeposit extends Pick<Deposit, 'amount' | 'paymentMethod'> {
	accountID: string;
}

export type UpdateDeposit = Pick<Deposit, 'status'>;

export interface DepositState {
	list: Deposit[];
	count: number;
	currentDeposit: Deposit | null;
	total: number;
}

export interface FindDepositsQueryParams extends PaginationOptions {
	accountID?: string;
}

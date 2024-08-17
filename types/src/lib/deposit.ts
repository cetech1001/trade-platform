import {User} from "./user";

export interface Deposit {
	id: string;
	amount: number;
	proof: string;
	paymentMethod: string;
	user: User;
	status: DepositStatus;
	createdAt: string;
	updatedAt: string;
}

export enum DepositStatus {
	pending = 'pending',
	confirmed = 'confirmed',
	rejected = 'rejected',
}

export interface CreateDeposit extends Pick<Deposit, 'amount' | 'paymentMethod'> {}

export interface UpdateDeposit extends Pick<Deposit, 'status'> {}

export interface DepositState {
	list: Deposit[];
	count: number;
	currentDeposit: Deposit | null;
}

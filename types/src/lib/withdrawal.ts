import {User} from "./user";

export interface Withdrawal {
	id: string;
	amount: number;
	paymentMethod: string;
	network: string;
	walletAddress: string;
	user: User;
	status: WithdrawalStatus;
	createdAt: string;
	updatedAt: string;
}

export enum WithdrawalStatus {
	pending = 'pending',
	paid = 'paid',
	canceled = 'canceled',
}

export interface CreateWithdrawal extends Pick<Withdrawal, 'amount' | 'paymentMethod' | 'walletAddress' | 'network'> {}
export interface UpdateWithdrawal extends Pick<Withdrawal, 'status'> {}

export interface WithdrawalState {
	list: Withdrawal[];
	count: number;
	currentWithdrawal: Withdrawal | null;
}

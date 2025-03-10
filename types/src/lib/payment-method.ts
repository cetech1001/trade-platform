export interface PaymentMethod {
	id: string;
	name: string;
	code: string;
	network: string;
	walletAddress: string;
	status: PaymentMethodStatus;
}

export enum PaymentMethodStatus {
	active = 'active',
	disabled = 'disabled',
}

export interface PaymentMethodState {
	list: PaymentMethod[];
	totalCount: number;
  totalPages: number;
	highlightedPaymentMethod: PaymentMethod | null;
}

export type CreatePaymentMethod = Omit<PaymentMethod, 'id'>;
export type UpdatePaymentMethod = Partial<PaymentMethod>;

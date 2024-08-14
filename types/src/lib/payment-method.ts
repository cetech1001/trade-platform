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
	count: number,
	currentPaymentMethod: PaymentMethod | null;
}

export interface CreatePaymentMethod extends Omit<PaymentMethod, 'id'> {}
export interface UpdatePaymentMethod extends Partial<PaymentMethod> {}

export interface PaymentMethod {
	id: string;
	name: string;
	currency: string;
	walletAddress: string;
	status: PaymentMethodStatus;
}

export enum PaymentMethodStatus {
	active = 'active',
	disabled = 'disabled',
}

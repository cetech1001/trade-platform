export interface CryptoCurrency {
	id: string;
	symbol: string;
	name: string;
	image: string;
}

export interface CreateCrypto extends Omit<CryptoCurrency, 'id'> {}

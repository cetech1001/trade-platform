export interface Forex {
	id: string;
	base: string;
	term: string;
	type: ForexType;
}

export enum ForexType {
	major = 'major',
	cross = 'cross',
	commodity = 'commodity',
	emerging_market =  'emerging_market',
}

export interface CreateForex extends Omit<Forex, 'id'> {}

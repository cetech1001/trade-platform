import {
	FindCryptoCurrencies,
	FindForexPairs,
	FindStockOptions,
	ForexPair,
	StockOption,
	CryptoCurrency, Paginated,
} from "@coinvant/types";
import {api} from "./api";

export class TradeAssetService {
	static async fetchStockOptions(query: FindStockOptions): Promise<Paginated<StockOption>> {
		const {data} = await api.get('/trade-asset/stock-options', {params: query});
		return data;
	}

	static async fetchForexPairs(query: FindForexPairs): Promise<Paginated<ForexPair>> {
		const {data} = await api.get('/trade-asset/forex-pairs', {params: query});
		return data;
	}

	static async fetchCryptoCurrencies(query: FindCryptoCurrencies): Promise<Paginated<CryptoCurrency>> {
		const {data} = await api.get('/trade-asset/crypto-currencies', {params: query});
		return data;
	}
}

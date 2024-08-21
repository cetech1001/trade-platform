import {CreateTrade, FindTradeQueryParams, Paginated, Trade, UpdateTrade} from "@coinvant/types";
import {api} from "./api";

export class TradeService {
	static async fetchTrades(query: FindTradeQueryParams): Promise<Paginated<Trade>> {
		const { data } = await api.get('/trade', {params: query});
		return data;
	}

	static async createTrade(payload: CreateTrade): Promise<Trade> {
		const { data } = await api.post('/trade', payload);
		return data;
	}

	static async updateTrade(id: string, payload: UpdateTrade): Promise<Trade> {
		let { data } = await api.patch(`/trade/${id}`, payload);
		return data;
	}

	static async deleteTrade(id: string) {
		await api.delete(`/trade/${id}`);
	}
}

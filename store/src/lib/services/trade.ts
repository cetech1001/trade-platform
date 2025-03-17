import {
  CreateTrade,
  FindTradeAmountsQueryParams,
  FindTradesQueryParams,
  Paginated,
  Trade,
  UpdateTrade
} from '@coinvant/types';
import {api} from "./api";

export class TradeService {
	static async fetchTrades(params: FindTradesQueryParams): Promise<Paginated<Trade>> {
		const { data } = await api.get('/trade', {params});
		return data;
	}

	static async createTrade(payload: CreateTrade): Promise<Trade> {
		const { data } = await api.post('/trade', payload);
		return data;
	}

  static async fetchTotalActivePL(query: FindTradeAmountsQueryParams): Promise<number> {
    const { data } = await api.get('/trade/total/pl', {
      params: query,
    });
    return data;
  }

  static async fetchTotalActiveBid(query: FindTradeAmountsQueryParams): Promise<number> {
    const { data } = await api.get('/trade/total/bid', {
      params: query,
    });
    return data;
  }

	static async updateTrade(id: string, payload: UpdateTrade): Promise<Trade> {
		const { data } = await api.patch(`/trade/${id}`, payload);
		return data;
	}

	static async deleteTrade(id: string) {
		await api.delete(`/trade/${id}`);
	}
}

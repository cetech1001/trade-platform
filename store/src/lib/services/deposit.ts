import {api} from "./api";
import {
  Paginated,
  UpdateDeposit,
  Deposit, Transaction, FindDepositsQueryParams
} from '@coinvant/types';

export class DepositService {
  static async getDeposits(params?: FindDepositsQueryParams): Promise<Paginated<Deposit>> {
    const { data } =  await api.get('/deposit', { params });
    return data;
  }

  static async createDeposit(payload: FormData): Promise<Transaction> {
    const { data } = await api.post('/deposit', payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  }

  static async updateDeposit(id: string, payload: UpdateDeposit): Promise<Deposit> {
    const { data } = await api.patch(`/deposit/${id}`, payload);
    return data;
  }

  static async fetchTotalDepositAmount(): Promise<number> {
    const { data } = await api.get('/deposit/total/amount');
    return data;
  }

  static async deleteDeposit(id: string) {
    await api.delete(`/deposit/${id}`);
  }
}

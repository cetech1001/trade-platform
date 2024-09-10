import {api} from "./api";
import {
  CreateWithdrawal, FindWithdrawalsQueryParams,
  Paginated,
  Transaction,
  UpdateWithdrawal,
  Withdrawal
} from '@coinvant/types';

export class WithdrawalService {
  static async getWithdrawals(params?: FindWithdrawalsQueryParams): Promise<Paginated<Withdrawal>> {
    const { data } =  await api.get('/withdrawal', { params });
    return data;
  }

  static async createWithdrawal(payload: CreateWithdrawal): Promise<Transaction> {
    const { data } = await api.post('/withdrawal', payload);
    return data;
  }

  static async updateWithdrawal(id: string, payload: UpdateWithdrawal): Promise<Withdrawal> {
    const { data } = await api.patch(`/withdrawal/${id}`, payload);
    return data;
  }

  static async fetchTotalWithdrawalAmount(): Promise<number> {
    const { data } = await api.get('/withdrawal/total/amount');
    return data;
  }

  static async deleteWithdrawal(id: string) {
    await api.delete(`/withdrawal/${id}`);
  }
}

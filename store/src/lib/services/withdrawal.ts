import {api} from "./api";
import {
  CreateWithdrawal,
  Paginated,
  PaginationOptions,
  UpdateWithdrawal,
  Withdrawal
} from "@coinvant/types";

export class WithdrawalService {
  static async getWithdrawals(options?: PaginationOptions): Promise<Paginated<Withdrawal>> {
    let { data } =  await api.get('/withdrawal', { params: options });
    return data;
  }

  static async createWithdrawal(payload: CreateWithdrawal): Promise<Withdrawal> {
    let { data } = await api.post('/withdrawal', payload);
    return data;
  }

  static async updateWithdrawal(id: string, payload: UpdateWithdrawal): Promise<Withdrawal> {
    let { data } = await api.patch(`/withdrawal/${id}`, payload);
    return data;
  }

  static async deleteWithdrawal(id: string) {
    await api.delete(`/withdrawal/${id}`);
  }
}

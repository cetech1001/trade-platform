import {api} from "./api";
import {
  Paginated,
  PaginationOptions,
  UpdateDeposit,
  Deposit, Transaction
} from "@coinvant/types";

export class DepositService {
  static async getDeposits(options?: PaginationOptions): Promise<Paginated<Deposit>> {
    let { data } =  await api.get('/deposit', { params: options });
    return data;
  }

  static async createDeposit(payload: FormData): Promise<Transaction> {
    let { data } = await api.post('/deposit', payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  }

  static async updateDeposit(id: string, payload: UpdateDeposit): Promise<Deposit> {
    let { data } = await api.patch(`/deposit/${id}`, payload);
    return data;
  }

  static async fetchTotalDepositAmount(): Promise<number> {
    let { data } = await api.get('/deposit/total/amount');
    return data;
  }

  static async deleteDeposit(id: string) {
    await api.delete(`/deposit/${id}`);
  }
}

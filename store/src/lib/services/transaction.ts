import {api} from "./api";
import {
  Paginated,
  PaginationOptions,
  Transaction
} from "@coinvant/types";

export class TransactionService {
  static async getTransactions(options?: PaginationOptions): Promise<Paginated<Transaction>> {
    let { data } =  await api.get('/transaction', { params: options });
    return data;
  }
}

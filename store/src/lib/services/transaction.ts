import {api} from "./api";
import {
  FindTransactionsQueryParams,
  Paginated,
  Transaction
} from '@coinvant/types';

export class TransactionService {
  static async getTransactions(params?: FindTransactionsQueryParams): Promise<Paginated<Transaction>> {
    const { data } =  await api.get('/transaction', { params });
    return data;
  }
}

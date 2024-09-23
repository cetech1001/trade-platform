import {api} from "./api";
import { UpdateAccount, Account } from '@coinvant/types';

export class AccountService {
  static async createAccount(): Promise<Account> {
    const { data } = await api.post('/account');
    return data;
  }

  static async updateAccount(id: string, payload: UpdateAccount): Promise<Account> {
    const { data } = await api.patch(`/account/${id}`, payload);
    return data;
  }

  static async deleteAccount(id: string) {
    await api.delete(`/account/${id}`);
  }
}

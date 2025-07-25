import {api} from "./api";
import { UpdateAccount, Account } from '@coinvant/types';

export class AccountService {
  static async createAccount(userID?: string): Promise<Account> {
    const { data } = await api.post(`/account/${userID || ""}`);
    return data;
  }

  static async getAccounts(userID: string): Promise<Account[]> {
    const { data } = await api.get(`/account/${userID}`);
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

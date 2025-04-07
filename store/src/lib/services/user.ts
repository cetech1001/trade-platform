import {api} from "./api";
import { CreateUser, KYC, Paginated, PaginationOptions, UpdateUser, User } from '@coinvant/types';

export class UserService {
  static async getUsers(options?: PaginationOptions): Promise<Paginated<User>> {
    const { data } =  await api.get('/user', { params: options });
    return data;
  }

  static async createUser(payload: CreateUser): Promise<User> {
    const { data } = await api.post('/user', payload);
    return data;
  }

  static async updateUser(id: string, payload: UpdateUser): Promise<User> {
    const { data } = await api.patch(`/user/${id}`, payload);
    return data;
  }

  static async uploadKYC(formData: FormData) {
    await api.post('/user/kyc', formData);
  }

  static async findKYC(params?: PaginationOptions): Promise<Paginated<KYC>> {
    const { data } = await api.get('/user/kyc/search', { params });
    return data;
  }

  static async deleteKYC(id: string) {
    await api.delete(`/user/kyc/${id}`);
  }

  static async deleteUser(id: string) {
    await api.delete(`/user/${id}`);
  }
}

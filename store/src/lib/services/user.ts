import {api} from "./api";
import {CreateUser, Paginated, PaginationOptions, UpdateUser, User} from "@coinvant/types";

export class UserService {
  static async getUsers(options?: PaginationOptions): Promise<Paginated<User>> {
    let { data } =  await api.get('/user', { params: options });
    return data;
  }

  static async getProfile(): Promise<User> {
    let { data } = await api.get('/user/profile');
    return data;
  }

  static async createUser(payload: CreateUser): Promise<User> {
    let { data } = await api.post('/user', payload);
    return data;
  }

  static async updateUser(id: string, payload: UpdateUser): Promise<User> {
    let { data } = await api.patch(`/user/${id}`, payload);
    return data;
  }

  static async deleteUser(id: string) {
    await api.delete(`/user/${id}`);
  }
}

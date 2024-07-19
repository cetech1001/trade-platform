import {api} from "./api";
import {Paginated, PaginationOptions, User} from "@coinvant/types";

export class UserService {
  static async getUsers(options?: PaginationOptions): Promise<Paginated<User>> {
    let { data } =  await api.get('/user', { params: options });
    return data;
  }
}

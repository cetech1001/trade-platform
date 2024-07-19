import {api} from "./api";

export class UserService {
  static async getProfile() {
    let { data } = await api.get('/user/profile');
    return data;
  }

  static async getUsers(): Promise<number> {
    let { data } =  await api.get('/user');
    return data;
  }
}

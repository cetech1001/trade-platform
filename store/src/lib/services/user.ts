import {api} from "./api";

export class UserService {
  async getProfile() {
    let { data } = await api.get('/user/profile');
    return data;
  }
}

import axios from "axios"
import {environment} from "../../environment/environment";
import {LoginRequest, LoginResponse, RegisterRequest} from "@coinvant/types";

export class AuthService {
  static async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await axios.post(environment.api.baseURL + '/auth/login', payload);
    return data;
  }

  static async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await axios.post(environment.api.baseURL + '/auth/register', payload);
    return data;
  }
}

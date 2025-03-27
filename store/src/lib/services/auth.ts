import axios from "axios"
import {environment} from "../../environments/environment";
import { LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, User } from '@coinvant/types';

export class AuthService {
  static async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await axios.post(environment.api.baseURL + '/auth/login', payload);
    return data;
  }

  static async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await axios.post(environment.api.baseURL + '/auth/register', payload);
    return data;
  }

  static sendResetLink(email: string) {
    return axios.post(environment.api.baseURL + '/auth/send-reset-link', { email });
  }

  static resetPassword(payload: ResetPasswordRequest): Promise<User> {
    return axios.post(environment.api.baseURL + '/auth/reset-password', payload);
  }
}

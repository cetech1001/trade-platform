import {User} from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

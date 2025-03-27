import {User} from "./user";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | undefined;
}

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

export interface ResetPasswordRequest {
  email: string;
  password: string;
  otp: string;
}

export type AuthUser = Omit<User, 'password'>;

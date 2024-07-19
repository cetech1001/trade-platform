export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: string;
  status: UserStatus;
  role: UserRole;
}

export interface UserState {
  list: User[];
  count: number;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  disabled = 'disabled',
}

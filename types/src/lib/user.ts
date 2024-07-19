export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: string;
  role: UserRole;
}

export interface UserState {
  list: User[];
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

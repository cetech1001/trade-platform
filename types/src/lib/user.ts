export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: string;
  role: UserRole;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

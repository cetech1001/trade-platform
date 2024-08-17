export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: number;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  list: User[];
  count: number;
  currentUser: User | null;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  disabled = 'disabled',
}

export interface CreateUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateUser extends Partial<CreateUser> {}

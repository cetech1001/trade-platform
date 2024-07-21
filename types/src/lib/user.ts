export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: number;
  status: UserStatus;
  role: UserRole;
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

export interface CreateUser extends Omit<User, 'id'> {}
export interface UpdateUser extends Partial<CreateUser> {}

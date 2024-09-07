export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  walletBalance: number;
  kycVerified: KYCStatus;
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

export enum KYCStatus {
  pending = 'pending',
  verified = 'verified',
  notStarted = 'notStarted',
}

export type CreateUser = Omit<User, 'id' | 'kycVerified' | 'createdAt' | 'updatedAt'>
export type UpdateUser = Partial<CreateUser>

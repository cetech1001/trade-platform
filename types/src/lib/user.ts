import { Account } from './account';
import { KYC } from './kyc';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  kycStatus: KYCStatus;
  status: UserStatus;
  role: UserRole;
  accounts: Account[];
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  list: User[];
  kycList: KYC[];
  totalKycCount: number;
  totalKycPages: number;
  totalUserCount: number;
  totalUserPages: number;
  highlightedUser: User | null;
  selectedAccount: Account | null;
  highlightedKYC: KYC | null;
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

export type CreateUser = Omit<User, 'id' | 'kycStatus' | 'accounts' | 'createdAt' | 'updatedAt'>
export interface UpdateUser extends Partial<CreateUser>, Partial<Pick<User, 'kycStatus'>> {}

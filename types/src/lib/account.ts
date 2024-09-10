import { User } from './user';

export interface Account {
  id: string;
  walletBalance: number;
  type: AccountType;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  live = 'live',
  demo = 'demo',
}

export interface CreateAccount extends Partial<Pick<Account, 'type'>> {
  userID: string;
}
export type UpdateAccount = Pick<Account, 'walletBalance'>;

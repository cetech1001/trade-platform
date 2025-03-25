import { User } from './user';

export interface Account {
  id: string;
  walletBalance: number;
  type: AccountType;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface AccountState {
  list: Account[];
  highlightedAccount: Account | null;
}

export enum AccountType {
  live = 'live',
  demo = 'demo',
}

export interface CreateAccount extends Partial<Pick<Account, 'type' | 'walletBalance'>> {
  user: User;
}
export type UpdateAccount = Pick<Account, 'walletBalance'>;

import { Account, AccountType, ErrorResponse } from '@coinvant/types';

export const getError = (e: unknown | ErrorResponse) => {
  const error = e as ErrorResponse;
  const message = Array.isArray(error.message) ? error.message[0] : (
    error.response?.data?.message
    || error.response?.data?.error
    || error.data?.message
    || error.data?.error
    || error.response?.message
    || error.response?.error
    || error.message
    || error.error)!;
  const status = (error.response?.data?.statusCode
    || error.response?.data?.status
    || error.data?.statusCode
    || error.data?.status
    || error.response?.statusCode
    || error.response?.status
    || error.statusCode
    || error.status)!;
  return { status, message };
}

export const getCurrentAccount = (accounts: Account[]) => {
  if (accounts.length === 0) {
    return undefined;
  } else if (accounts.length === 1) {
    return accounts[0];
  }
  const accountType = localStorage.getItem('accountType');
  return accounts.find(({ type }) => type === (accountType || AccountType.demo));
}

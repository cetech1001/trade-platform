import { AppDispatch } from '../../index';
import { AccountActions } from '../types';
import { Account, UpdateAccount } from '@coinvant/types';
import { getError } from '../helpers';
import { showAlert } from './alert';
import { AccountService } from '../services/account';

export const fetchAccounts = (accountID: string) => async (dispatch: AppDispatch) => {
	try {
		const data = await AccountService.getAccounts(accountID);
		dispatch({
			type: AccountActions.LIST,
			payload: {
				list: data,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch accounts.',
			type: 'error',
			show: true,
		}));
	}
}

export const addAccount = (userID?: string) => async (dispatch: AppDispatch) => {
	try {
		const data = await AccountService.createAccount(userID);
		dispatch({
			type: AccountActions.CREATE,
			payload: {
				highlightedAccount: data,
			},
		});
		dispatch(showAlert({
			message: 'Account created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to create account.',
			type: 'error',
			show: true,
		}));
	}
}

export const editAccount = (id: string, payload: UpdateAccount) => async (dispatch: AppDispatch) => {
	try {
		const data = await AccountService.updateAccount(id, payload);
		dispatch({
			type: AccountActions.UPDATE,
			payload: {
				highlightedAccount: data,
			},
		});
		dispatch(showAlert({
			message: 'Account updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to update account.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeAccount = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await AccountService.deleteAccount(id);
		dispatch({
			type: AccountActions.DELETE,
		});
		dispatch(showAlert({
			message: 'Account deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to delete account.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentAccount = (account?: Account) => async (dispatch: AppDispatch) => {
	dispatch({
		type: AccountActions.SET_CURRENT_ACCOUNT,
		payload: {
			highlightedAccount: account,
		},
	});
}

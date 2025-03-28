import {AppDispatch} from "../../index";
import {WithdrawalService} from "../services";
import {TransactionActions, WithdrawalActions} from "../types";
import {
	CreateWithdrawal,
	FindWithdrawalsQueryParams,
	UpdateWithdrawal,
	Withdrawal
} from '@coinvant/types';
import { showAlert } from './alert';
import { getError } from '../helpers';


export const fetchWithdrawals = (query?: FindWithdrawalsQueryParams) => async (dispatch: AppDispatch) => {
	try {
		const data = await WithdrawalService.getWithdrawals(query);
		dispatch({
			type: WithdrawalActions.LIST,
			payload: {
				list: data.items,
				totalCount: data.meta.totalItems,
        totalPages: data.meta.totalPages,
			},
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch withdrawals.',
			type: 'error',
			show: true,
		}));
	}
}

export const addWithdrawal = (payload: CreateWithdrawal) => async (dispatch: AppDispatch) => {
	try {
		const data = await WithdrawalService.createWithdrawal(payload);
		dispatch({
			type: TransactionActions.ADD,
			payload: {
				highlightedTransaction: data,
			},
		});
		dispatch(showAlert({
			message: 'Withdrawal created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to create withdrawal.',
			type: 'error',
			show: true,
		}));
	}
}

export const editWithdrawal = (id: string, payload: UpdateWithdrawal) => async (dispatch: AppDispatch) => {
	try {
		const data = await WithdrawalService.updateWithdrawal(id, payload);
		dispatch({
			type: WithdrawalActions.UPDATE,
			payload: {
				highlightedWithdrawal: data,
			},
		});
		dispatch(showAlert({
			message: 'Withdrawal updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to update withdrawal.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeWithdrawal = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await WithdrawalService.deleteWithdrawal(id);
		dispatch({
			type: WithdrawalActions.DELETE,
		});
		dispatch(showAlert({
			message: 'Withdrawal deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to delete withdrawal.',
			type: 'error',
			show: true,
		}));
	}
}

export const setTotalWithdrawalAmount = () => async (dispatch: AppDispatch) => {
	try {
		const total = await WithdrawalService.fetchTotalWithdrawalAmount();
		dispatch({
			type: WithdrawalActions.SET_TOTAL,
			payload: {
				totalWithdrawalAmount: total,
			}
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch total withdrawal amount.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentWithdrawal = (withdrawal: Withdrawal) => async (dispatch: AppDispatch) => {
	dispatch({
		type: WithdrawalActions.SET_CURRENT_WITHDRAWAL,
		payload: { highlightedWithdrawal: withdrawal },
	});
}

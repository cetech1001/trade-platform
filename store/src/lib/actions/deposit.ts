import {AppDispatch} from "../../index";
import {DepositService} from "../services";
import {DepositActions, TransactionActions} from "../types";
import { Deposit, FindDepositsQueryParams, UpdateDeposit } from '@coinvant/types';
import { showAlert } from './alert';

export const fetchDeposits = (query?: FindDepositsQueryParams) => async (dispatch: AppDispatch) => {
	try {
		const data = await DepositService.getDeposits(query);
		dispatch({
			type: DepositActions.LIST,
			payload: {
				list: data.items,
				totalCount: data.meta.totalItems,
        totalPages: data.meta.totalPages,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch deposits.',
			type: 'error',
			show: true,
		}));
	}
}

export const addDeposit = (payload: FormData) => async (dispatch: AppDispatch) => {
	try {
		const data = await DepositService.createDeposit(payload);
		dispatch({
			type: TransactionActions.ADD,
			payload: {
				highlightedTransaction: data,
			},
		});
		dispatch(showAlert({
			message: 'Deposit created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to create deposit.',
			type: 'error',
			show: true,
		}));
	}
}

export const editDeposit = (id: string, payload: UpdateDeposit) => async (dispatch: AppDispatch) => {
	try {
		const data = await DepositService.updateDeposit(id, payload);
		dispatch({
			type: DepositActions.UPDATE,
			payload: {
				highlightedDeposit: data,
			},
		});
		dispatch(showAlert({
			message: 'Deposit updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to update deposit.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeDeposit = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await DepositService.deleteDeposit(id);
		dispatch({
			type: DepositActions.DELETE,
		});
		dispatch(showAlert({
			message: 'Deposit deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to delete deposit.',
			type: 'error',
			show: true,
		}));
	}
}

export const setTotalDepositAmount = () => async (dispatch: AppDispatch) => {
	try {
		const totalDepositAmount = await DepositService.fetchTotalDepositAmount();
		dispatch({
			type: DepositActions.SET_TOTAL,
			payload: {
				totalDepositAmount,
			}
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch total deposit amount.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentDeposit = (deposit: Deposit) => async (dispatch: AppDispatch) => {
	dispatch({
		type: DepositActions.SET_CURRENT_DEPOSIT,
		payload: { highlightedDeposit: deposit },
	});
}

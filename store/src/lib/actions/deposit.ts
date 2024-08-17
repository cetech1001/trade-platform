import {AppDispatch, showAlert} from "@coinvant/store";
import {DepositService} from "../services";
import {DepositActions} from "../types";
import {PaginationOptions, UpdateDeposit, Deposit} from "@coinvant/types";

export const fetchDeposits = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await DepositService.getDeposits(options);
		dispatch({
			type: DepositActions.LIST,
			payload: {
				list: data.items,
				count: data.meta.totalItems,
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
			type: DepositActions.CREATE,
			payload: {
				currentDeposit: data,
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
				currentDeposit: data,
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

export const setCurrentDeposit = (deposit: Deposit) => async (dispatch: AppDispatch) => {
	dispatch({
		type: DepositActions.SET_CURRENT_DEPOSIT,
		payload: { currentDeposit: deposit },
	});
}

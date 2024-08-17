import {AppDispatch, showAlert} from "@coinvant/store";
import {TransactionService} from "../services";
import {TransactionActions} from "../types";
import {PaginationOptions, Transaction} from "@coinvant/types";

export const fetchTransactions = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await TransactionService.getTransactions(options);
		dispatch({
			type: TransactionActions.LIST,
			payload: {
				list: data.items,
				count: data.meta.totalItems,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch transactions.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentTransaction = (transaction: Transaction) => async (dispatch: AppDispatch) => {
	dispatch({
		type: TransactionActions.SET_CURRENT_TRANSACTION,
		payload: { currentTransaction: transaction },
	});
}

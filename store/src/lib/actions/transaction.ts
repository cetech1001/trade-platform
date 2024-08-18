import {AppDispatch, showAlert} from "@coinvant/store";
import {TransactionService} from "../services";
import {TransactionActions} from "../types";
import {PaginationOptions} from "@coinvant/types";

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

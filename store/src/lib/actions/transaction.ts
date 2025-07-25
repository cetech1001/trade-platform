import {AppDispatch} from "../../index";
import {TransactionService} from "../services";
import {TransactionActions} from "../types";
import { FindTransactionsQueryParams } from '@coinvant/types';
import { showAlert } from './alert';
import { getError } from '../helpers';

export const fetchTransactions = (query?: FindTransactionsQueryParams) => async (dispatch: AppDispatch) => {
	try {
		const data = await TransactionService.getTransactions(query);
		dispatch({
			type: TransactionActions.LIST,
			payload: {
				list: data.items,
				totalCount: data.meta.totalItems,
        totalPages: data.meta.totalPages,
			},
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch transactions.',
			type: 'error',
			show: true,
		}));
	}
}

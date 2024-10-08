import {AppDispatch} from "../../index";
import {TradeService} from "../services";
import {TradeActions} from "../types";
import { showAlert } from './alert';

import {CreateTrade, UpdateTrade, FindTradeQueryParams} from "@coinvant/types";
import { getError } from '../helpers';

export const fetchTrades = (query: FindTradeQueryParams) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.fetchTrades(query);
		dispatch({
			type: TradeActions.fetchTrades,
			payload: {
				trades: data.items,
				totalCount: data.meta.totalItems,
				totalPages: data.meta.totalPages,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch trades.',
			type: 'error',
			show: true,
		}));
	}
}

export const placeBid = (payload: CreateTrade) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.createTrade(payload);
		dispatch({
			type: TradeActions.createTrade,
			payload: {
				trade: data,
			},
		});
		dispatch(showAlert({
			message: 'Order placed successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to place order.',
			type: 'error',
			show: true,
		}));
	}
}

export const updateTrade = (id: string, payload: UpdateTrade) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.updateTrade(id, payload);
		dispatch({
			type: TradeActions.updateTrade,
			payload: {
				trade: data,
			},
		});
		dispatch(showAlert({
			message: 'Order updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to update order.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeTrade = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await TradeService.deleteTrade(id);
		dispatch({
			type: TradeActions.deleteTrade,
		});
		dispatch(showAlert({
			message: 'Trade deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to delete trade.',
			type: 'error',
			show: true,
		}));
	}
}

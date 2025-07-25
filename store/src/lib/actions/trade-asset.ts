import {
	CurrentAsset,
	FindCryptoCurrencies,
	FindForexPairs,
	FindStockOptions,
} from "@coinvant/types";
import {AppDispatch, showAlert} from "../../index";
import {TradeAssetService} from "../services";
import {TradeAssetActions} from "../types";
import { getError } from '../helpers';

export const fetchStockOptions = (query: FindStockOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeAssetService.fetchStockOptions(query);
		dispatch({
			type: TradeAssetActions.fetchStockOptions,
			payload: {
				list: data.items,
				page: query.page,
				totalPages: data.meta.totalPages,
			},
		});
	} catch (e) {
    const { message } = getError(e);
		dispatch(showAlert({
			message: message || 'Failed to fetch stock options.',
			type: 'error',
			show: true,
		}));
	}
}

export const fetchForexPairs = (query: FindForexPairs) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeAssetService.fetchForexPairs(query);
		dispatch({
			type: TradeAssetActions.fetchForexPairs,
			payload: {
				list: data.items,
				page: query.page,
				totalPages: data.meta.totalPages,
			},
		});
	} catch (e) {
    const { message } = getError(e);
		dispatch(showAlert({
			message: message || 'Failed to fetch forex pairs.',
			type: 'error',
			show: true,
		}));
	}
}

export const fetchCryptoCurrencies = (query: FindCryptoCurrencies) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeAssetService.fetchCryptoCurrencies(query);
		dispatch({
			type: TradeAssetActions.fetchCryptoCurrencies,
			payload: {
				list: data.items,
				totalPages: data.meta.totalPages,
				page: query.page,
			},
		});
	} catch (e) {
    const { message } = getError(e);
		dispatch(showAlert({
			message: message || 'Failed to fetch crypto currencies.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentAsset = (asset: CurrentAsset) => async (dispatch: AppDispatch) => {
	dispatch({
		type: TradeAssetActions.setCurrentAsset,
		payload: { asset },
	});
}

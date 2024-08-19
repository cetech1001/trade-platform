import {FindCryptoCurrencies, FindForexPairs, FindStockOptions} from "@coinvant/types";
import {AppDispatch, showAlert} from "../../index";
import {TradeAssetService} from "../services";
import {TradeAssetActions} from "../types";

export const fetchStockOptions = (query: FindStockOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeAssetService.fetchStockOptions(query);
		dispatch({
			type: TradeAssetActions.fetchStockOptions,
			payload: {
				list: data.items,
				totalPages: data.meta.totalPages,
			},
		});
	} catch (e) {
		dispatch(showAlert({
			message: 'Failed to fetch stock options.',
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
				totalPages: data.meta.totalPages,
			},
		});
	} catch (e) {
		dispatch(showAlert({
			message: 'Failed to fetch forex pairs.',
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
		dispatch(showAlert({
			message: 'Failed to fetch crypto currencies.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentAsset = (symbol: string) => async (dispatch: AppDispatch) => {
	dispatch({
		type: TradeAssetActions.setCurrentAsset,
		payload: { symbol },
	});
}

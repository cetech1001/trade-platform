import {PayloadAction} from "@reduxjs/toolkit";
import {TradeAssetActions} from "../types";
import {CurrentAsset, TradeAssetType} from "@coinvant/types";

const initialState = {
	currentAsset: null,
	stock: {
		list: [],
		totalPages: 0,
	},
	forex: {
		list: [],
		totalPages: 0,
	},
	crypto: {
		list: [],
		totalPages: 0,
	}
}

interface Payload {
	list: any[];
	totalPages: number;
	page: number;
	asset: CurrentAsset;
}

const reducer = (state = initialState, action: PayloadAction<Payload>) => {
	let list = [];
	switch (action.type) {
		case TradeAssetActions.fetchStockOptions:
			if (action.payload.page === 1) {
				list = action.payload.list;
			} else {
				list = [...state.stock.list, ...action.payload.list];
			}
			return {
				...state,
				stock: {
					list,
					totalPages: action.payload.totalPages,
				}
			};
		case TradeAssetActions.fetchCryptoCurrencies:
			if (action.payload.page === 1) {
				list = action.payload.list;
			} else {
				list = [...state.crypto.list, ...action.payload.list];
			}
			return {
				...state,
				crypto: {
					list,
					totalPages: action.payload.totalPages,
				}
			};
		case TradeAssetActions.fetchForexPairs:
			if (action.payload.page === 1) {
				list = action.payload.list;
			} else {
				list = [...state.forex.list, ...action.payload.list];
			}
			return {
				...state,
				forex: {
					list,
					totalPages: action.payload.totalPages,
				}
			};
		case TradeAssetActions.setCurrentAsset:
			return {
				...state,
				currentAsset: action.payload.asset,
			}
		default:
			return state;
	}
}

export default reducer;

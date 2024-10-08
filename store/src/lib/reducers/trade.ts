import {PayloadAction} from "@reduxjs/toolkit";
import {TradeActions} from "../types";
import {Trade} from "@coinvant/types";

interface TradePayload {
	trades: Trade[];
	trade: Trade;
	totalCount: number;
	totalPages: number;
}

const initialState = {
	list: [],
	totalCount: 0,
	limit: 5,
	totalPages: 0,
	currentTrade: null,
}

const reducer = (state = initialState, action: PayloadAction<TradePayload>) => {
	switch (action.type) {
		case TradeActions.FETCH_TRADES:
			return {
				...state,
				list: action.payload.trades,
				totalCount: action.payload.totalCount,
			};
		case TradeActions.CREATE_TRADE:
			return {
				...state,
				list: [
					action.payload.trade,
					...state.list.filter((_, i) => i < state.list.length - 1)
				],
				totalCount: state.totalCount + 1,
			}
		case TradeActions.SET_CURRENT_TRADE:
			return {
				...state,
				currentTrade: action.payload.trade,
			}
		case TradeActions.UPDATE_TRADE:
			return {
				...state,
				list: state.list.map((trade: Trade) => {
					if (trade.id === action.payload.trade.id) {
						return action.payload.trade;
					}
					return trade;
				}),
			};
		case TradeActions.DELETE_TRADE:
			return {
				...state,
				list: state.list.filter((trade: Trade) => trade.id !== action.payload.trade.id),
				totalCount: state.totalCount - 1,
			}
		default:
			return state;
	}
}

export default reducer;

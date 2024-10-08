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
}

const reducer = (state = initialState, action: PayloadAction<TradePayload>) => {
	switch (action.type) {
		case TradeActions.fetchTrades:
			return {
				...state,
				list: action.payload.trades,
				totalCount: action.payload.totalCount,
			};
		case TradeActions.createTrade:
			return {
				...state,
				list: [
					action.payload.trade,
					...state.list.filter((_, i) => i < state.list.length - 1)
				],
				totalCount: state.totalCount + 1,
			}
		case TradeActions.updateTrade:
			return {
				...state,
				list: state.list.map((trade: Trade) => {
					if (trade.id === action.payload.trade.id) {
						return action.payload.trade;
					}
					return trade;
				}),
			};
		case TradeActions.deleteTrade:
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

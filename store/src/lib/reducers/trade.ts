import {PayloadAction} from "@reduxjs/toolkit";
import {TradeActions} from "../types";
import { Trade, TradeState } from '@coinvant/types';

const initialState: TradeState = {
	list: [],
	limit: 5,
  totalCount: 0,
  totalPages: 0,
  totalActivePL: 0,
  totalActiveBid: 0,
	highlightedTrade: null,
}

let tempList = [];
const reducer = (state: TradeState = initialState, action: PayloadAction<TradeState>) => {
	switch (action.type) {
		case TradeActions.FETCH_TRADES:
			return {
				...state,
				list: action.payload.list,
				totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
			};
    case TradeActions.SET_TOTAL_ACTIVE_PL:
      return {
        ...state,
        totalActivePL: action.payload.totalActivePL,
      };
    case TradeActions.SET_TOTAL_ACTIVE_BID:
      return {
        ...state,
        totalActiveBid: action.payload.totalActiveBid,
      };
		case TradeActions.CREATE_TRADE:
      if (action.payload.highlightedTrade) {
        tempList = [
          action.payload.highlightedTrade,
          ...state.list.filter((_, i) => i < state.list.length - 1)
        ];
      } else {
        tempList = [...state.list];
      }
			return {
				...state,
        list: tempList,
				totalCount: state.totalCount + 1,
			}
		case TradeActions.SET_CURRENT_TRADE:
			return {
				...state,
				highlightedTrade: action.payload.highlightedTrade,
			}
		case TradeActions.UPDATE_TRADE:
			return {
				...state,
				list: state.list.map((trade: Trade) => {
					if (trade.id === action.payload.highlightedTrade?.id) {
						return action.payload.highlightedTrade;
					}
					return trade;
				}),
			};
		case TradeActions.DELETE_TRADE:
			return {
				...state,
				list: state.list.filter((trade: Trade) => trade.id !== action.payload.highlightedTrade?.id),
				totalCount: state.totalCount - 1,
			}
		default:
			return state;
	}
}

export default reducer;

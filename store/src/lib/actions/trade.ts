import {AppDispatch} from "../../index";
import {TradeService} from "../services";
import {TradeActions} from "../types";
import { showAlert } from './alert';

import { CreateTrade, UpdateTrade, FindTradesQueryParams, Trade, FindTradeAmountsQueryParams } from '@coinvant/types';
import { getError } from '../helpers';

export const fetchTrades = (query: FindTradesQueryParams) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.fetchTrades(query);
		dispatch({
			type: TradeActions.FETCH_TRADES,
			payload: {
				list: data.items,
				totalCount: data.meta.totalItems,
				totalPages: data.meta.totalPages,
			},
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch trades.',
			type: 'error',
			show: true,
		}));
	}
}

export const fetchTotalActivePL = (query: FindTradeAmountsQueryParams) => async (dispatch: AppDispatch) => {
  try {
    const data = await TradeService.fetchTotalActivePL(query);
    dispatch({
      type: TradeActions.SET_TOTAL_ACTIVE_PL,
      payload: {
        totalActivePL: data,
      }
    })
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      message: message || 'Failed to fetch total active trade balance.',
      type: 'error',
      show: true,
    }));
  }
}

export const fetchTotalActiveBid = (query: FindTradeAmountsQueryParams) => async (dispatch: AppDispatch) => {
  try {
    const data = await TradeService.fetchTotalActiveBid(query);
    dispatch({
      type: TradeActions.SET_TOTAL_ACTIVE_BID,
      payload: {
        totalActiveBid: data,
      }
    })
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      message: message || 'Failed to fetch total active trade bids.',
      type: 'error',
      show: true,
    }));
  }
}

export const placeBid = (payload: CreateTrade) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.createTrade(payload);
		dispatch({
			type: TradeActions.CREATE_TRADE,
			payload: {
				highlightedTrade: data,
			},
		});
		dispatch(showAlert({
			message: 'Order placed successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to place order.',
			type: 'error',
			show: true,
		}));
	}
}

export const updateTrade = (id: string, payload: UpdateTrade) => async (dispatch: AppDispatch) => {
	try {
		const data = await TradeService.updateTrade(id, payload);
		dispatch({
			type: TradeActions.UPDATE_TRADE,
			payload: {
				highlightedTrade: data,
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

export const removeTrade = (highlightedTrade: Trade) => async (dispatch: AppDispatch) => {
	try {
		await TradeService.deleteTrade(highlightedTrade.id);
		dispatch({
			type: TradeActions.DELETE_TRADE,
      payload: {
        highlightedTrade,
      }
		});
		dispatch(showAlert({
			message: 'Trade deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to delete trade.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentTrade = (trade: Trade) => async (dispatch: AppDispatch) => {
	dispatch({
		type: TradeActions.SET_CURRENT_TRADE,
		payload: {
			highlightedTrade: trade,
		}
	});
}

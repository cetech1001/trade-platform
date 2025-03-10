import {WithdrawalState, WithdrawalStatus} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {WithdrawalActions} from "../types";

const initialState: WithdrawalState = {
	list: [],
	totalCount: 0,
  totalPages: 0,
	highlightedWithdrawal: null,
	totalWithdrawalAmount: 0,
}

const reducer = (state = initialState, action: PayloadAction<WithdrawalState>) => {
	switch (action.type) {
		case WithdrawalActions.LIST:
			return {
				...state,
				list: action.payload.list,
				totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages
			};
		case WithdrawalActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(withdrawal => {
						return withdrawal.id === state.highlightedWithdrawal?.id
            && action.payload.highlightedWithdrawal
              ? action.payload.highlightedWithdrawal : withdrawal;
					})
				],
				totalWithdrawalAmount: action.payload.highlightedWithdrawal?.status === WithdrawalStatus.paid
				&& state.list.find(withdrawal =>
          withdrawal.id === action.payload.highlightedWithdrawal?.id)?.status
        !== WithdrawalStatus.paid
					? state.totalWithdrawalAmount + (+action.payload.highlightedWithdrawal.amount) : state.totalWithdrawalAmount,
			};
		case WithdrawalActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(withdrawal => withdrawal.id !== state.highlightedWithdrawal?.id)
				],
				totalCount: state.totalCount - 1,
			};
		case WithdrawalActions.SET_TOTAL:
			return {
				...state,
				totalWithdrawalAmount: action.payload.totalWithdrawalAmount,
			}
		case WithdrawalActions.SET_CURRENT_WITHDRAWAL:
			return {
				...state,
				highlightedWithdrawal: action.payload.highlightedWithdrawal,
			}
		default:
			return state;
	}
}

export default reducer;

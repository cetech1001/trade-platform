import {DepositState, DepositStatus} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {DepositActions} from "../types";

const initialState: DepositState = {
	list: [],
	totalCount: 0,
  totalPages: 1,
	highlightedDeposit: null,
	totalDepositAmount: 0,
}

let tempList = [];
const reducer = (state: DepositState = initialState, action: PayloadAction<DepositState>) => {
	switch (action.type) {
		case DepositActions.LIST:
			return {
				...state,
				list: action.payload.list,
				totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages,
			};
		case DepositActions.UPDATE:
      if (action.payload.highlightedDeposit) {
        const updatedDeposit = action.payload.highlightedDeposit;
        tempList = state.list.map(deposit =>
          deposit.id === updatedDeposit.id ? updatedDeposit : deposit
        );
      } else {
        tempList = [...state.list];
      }
			return {
				...state,
        list: tempList,
				totalDepositAmount: action.payload.highlightedDeposit?.status === DepositStatus.confirmed
				&& state.list.find(deposit =>
          deposit.id === action.payload.highlightedDeposit?.id)?.status !== DepositStatus.confirmed
					? state.totalDepositAmount
          + (+action.payload.highlightedDeposit.amount)
          : state.totalDepositAmount,
			};
		case DepositActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(deposit =>
						deposit.id !== state.highlightedDeposit?.id)
				],
				totalCount: state.totalCount - 1,
			};
		case DepositActions.SET_TOTAL:
			return {
				...state,
				totalDepositAmount: action.payload.totalDepositAmount,
			};
		case DepositActions.SET_CURRENT_DEPOSIT:
			return {
				...state,
				highlightedDeposit: action.payload.highlightedDeposit,
			}
		default:
			return state;
	}
}

export default reducer;

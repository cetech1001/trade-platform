import {WithdrawalState, WithdrawalStatus} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {WithdrawalActions} from "../types";

const initialState: WithdrawalState = {
	list: [],
	count: 0,
	currentWithdrawal: null,
	total: 0,
}

const reducer = (state = initialState, action: PayloadAction<WithdrawalState>) => {
	switch (action.type) {
		case WithdrawalActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case WithdrawalActions.UPDATE:
			const { currentWithdrawal } = action.payload;
			const prevWithdrawal = state.list.find(withdrawal =>
				withdrawal.id === currentWithdrawal?.id);
			return {
				...state,
				list: [
					...state.list.map(withdrawal => {
						if (withdrawal.id === state.currentWithdrawal?.id) {
							return action.payload.currentWithdrawal!;
						}
						return withdrawal;
					})
				],
				total: currentWithdrawal?.status === WithdrawalStatus.paid
				&& prevWithdrawal?.status !== WithdrawalStatus.paid
					? state.total + (+currentWithdrawal.amount) : state.total,
			};
		case WithdrawalActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(withdrawal => withdrawal.id !== state.currentWithdrawal?.id)
				],
				count: state.count - 1,
			};
		case WithdrawalActions.SET_TOTAL:
			return {
				...state,
				total: action.payload.total,
			}
		case WithdrawalActions.SET_CURRENT_WITHDRAWAL:
			return {
				...state,
				currentWithdrawal: action.payload.currentWithdrawal,
			}
		default:
			return state;
	}
}

export default reducer;

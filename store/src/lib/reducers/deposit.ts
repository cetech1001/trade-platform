import {DepositState, DepositStatus} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {DepositActions} from "../types";

const initialState: DepositState = {
	list: [],
	count: 0,
	currentDeposit: null,
	total: 0,
}

const reducer = (state = initialState, action: PayloadAction<DepositState>) => {
	switch (action.type) {
		case DepositActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case DepositActions.UPDATE:
			const { currentDeposit } = action.payload;
			const prevDeposit = state.list.find(deposit =>
				deposit.id === currentDeposit?.id);
			return {
				...state,
				list: [
					...state.list.map(deposit => {
						if (deposit.id === state.currentDeposit?.id) {
							return currentDeposit!;
						}
						return deposit;
					})
				],
				total: currentDeposit?.status === DepositStatus.confirmed
				&& prevDeposit?.status !== DepositStatus.confirmed
					? state.total + (+currentDeposit.amount) : state.total,
			};
		case DepositActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(deposit =>
						deposit.id !== state.currentDeposit?.id)
				],
				count: state.count - 1,
			};
		case DepositActions.SET_TOTAL:
			return {
				...state,
				total: action.payload.total,
			};
		case DepositActions.SET_CURRENT_DEPOSIT:
			return {
				...state,
				currentDeposit: action.payload.currentDeposit,
			}
		default:
			return state;
	}
}

export default reducer;

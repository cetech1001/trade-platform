import {WithdrawalState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {WithdrawalActions} from "../types";

const initialState: WithdrawalState = {
	list: [],
	count: 0,
	currentWithdrawal: null,
}

const reducer = (state = initialState, action: PayloadAction<WithdrawalState>) => {
	switch (action.type) {
		case WithdrawalActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case WithdrawalActions.CREATE:
			return {
				...state,
				list: [ ...state.list, action.payload.currentWithdrawal! ],
				count: state.count + 1,
			};
		case WithdrawalActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === state.currentWithdrawal?.id) {
							return action.payload.currentWithdrawal!;
						}
						return user;
					})
				]
			};
		case WithdrawalActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.currentWithdrawal?.id)
				],
				count: state.count - 1,
			};
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

import {DepositState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {DepositActions} from "../types";

const initialState: DepositState = {
	list: [],
	count: 0,
	currentDeposit: null,
}

const reducer = (state = initialState, action: PayloadAction<DepositState>) => {
	switch (action.type) {
		case DepositActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case DepositActions.CREATE:
			return {
				...state,
				list: [ ...state.list, action.payload.currentDeposit! ],
				count: state.count + 1,
			};
		case DepositActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === state.currentDeposit?.id) {
							return action.payload.currentDeposit!;
						}
						return user;
					})
				]
			};
		case DepositActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.currentDeposit?.id)
				],
				count: state.count - 1,
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

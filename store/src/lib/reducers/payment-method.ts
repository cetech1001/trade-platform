import {PaymentMethodState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {PaymentMethodActions} from "../types";

const initialState: PaymentMethodState = {
	list: [],
	count: 0,
	currentPaymentMethod: null,
}

const reducer = (state = initialState, action: PayloadAction<PaymentMethodState>) => {
	switch (action.type) {
		case PaymentMethodActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case PaymentMethodActions.CREATE:
			return {
				...state,
				list: [ ...state.list, action.payload.currentPaymentMethod! ],
				count: state.count + 1,
			};
		case PaymentMethodActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === state.currentPaymentMethod?.id) {
							return action.payload.currentPaymentMethod!;
						}
						return user;
					})
				]
			};
		case PaymentMethodActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.currentPaymentMethod?.id)
				],
				count: state.count - 1,
			};
		case PaymentMethodActions.SET_CURRENT_USER:
			return {
				...state,
				currentPaymentMethod: action.payload.currentPaymentMethod,
			}
		default:
			return state;
	}
}

export default reducer;

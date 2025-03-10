import {PaymentMethodState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {PaymentMethodActions} from "../types";

const initialState: PaymentMethodState = {
	list: [],
	totalCount: 0,
  totalPages: 0,
	highlightedPaymentMethod: null,
}

const reducer = (state = initialState, action: PayloadAction<PaymentMethodState>) => {
	switch (action.type) {
		case PaymentMethodActions.LIST:
			return {
				...state,
				list: action.payload.list,
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages
			};
		case PaymentMethodActions.CREATE:
      if (action.payload.highlightedPaymentMethod) {
        state.list = [
          action.payload.highlightedPaymentMethod,
          ...state.list.filter((_, i) => i < 9)
        ];
      }
			return {
				...state,
				totalCount: state.totalCount + 1,
			};
		case PaymentMethodActions.UPDATE:
      if (action.payload.highlightedPaymentMethod) {
        const updatedPaymentMethod = action.payload.highlightedPaymentMethod;
        state.list = [
          ...state.list.map(user => {
            return user.id === state.highlightedPaymentMethod?.id
              ? updatedPaymentMethod : user;
          })
        ];
      }
			return state;
		case PaymentMethodActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.highlightedPaymentMethod?.id)
				],
        totalCount: state.totalCount - 1,
			};
		case PaymentMethodActions.SET_CURRENT_PAYMENT_METHOD:
			return {
				...state,
				highlightedPaymentMethod: action.payload.highlightedPaymentMethod,
			}
		default:
			return state;
	}
}

export default reducer;

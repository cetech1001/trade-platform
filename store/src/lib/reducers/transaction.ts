import {TransactionState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {TransactionActions} from "../types";

const initialState: TransactionState = {
	list: [],
	count: 0,
	currentTransaction: null,
}

const reducer = (state = initialState, action: PayloadAction<TransactionState>) => {
	switch (action.type) {
		case TransactionActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case TransactionActions.SET_CURRENT_TRANSACTION:
			return {
				...state,
				currentTransaction: action.payload.currentTransaction,
			}
		default:
			return state;
	}
}

export default reducer;

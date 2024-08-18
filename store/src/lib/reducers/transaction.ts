import {Transaction, TransactionState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {TransactionActions} from "../types";

const initialState: TransactionState = {
	list: [],
	count: 0,
}

const reducer = (state = initialState, action: PayloadAction<TransactionState & { transaction: Transaction }>) => {
	switch (action.type) {
		case TransactionActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case TransactionActions.ADD:
			return {
				...state,
				list: [ action.payload.transaction, ...state.list ],
				count: state.count + 1,
			};
		default:
			return state;
	}
}

export default reducer;

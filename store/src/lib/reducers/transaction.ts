import {TransactionState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {TransactionActions} from "../types";

const initialState: TransactionState = {
	list: [],
  highlightedTransaction: null,
	totalCount: 0,
  totalPages: 0,
}

const reducer = (state = initialState, action: PayloadAction<TransactionState>) => {
	switch (action.type) {
		case TransactionActions.LIST:
			return {
				...state,
				list: action.payload.list,
        totalCount: action.payload.totalCount,
        totalPages: action.payload.totalPages
			};
		case TransactionActions.ADD:
      if (action.payload.highlightedTransaction) {
        state.list = [
          action.payload.highlightedTransaction,
          ...state.list.filter((_, i) => i < 9),
        ]
      }
			return {
				...state,
        totalCount: state.totalCount + 1,
			};
		default:
			return state;
	}
}

export default reducer;

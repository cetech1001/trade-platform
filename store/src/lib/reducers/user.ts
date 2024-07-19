import {User, UserState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {UserType} from "../types";

const initialState: UserState = {
	count: 0,
	list: [],
}

const reducer = (state = initialState, action: PayloadAction<UserState & { user: User }>) => {
	switch (action.type) {
		case UserType.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case UserType.CREATE:
			return {
				...state,
				list: [ ...state.list, action.payload.user ],
				count: state.count + 1,
			};
		case UserType.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === action.payload.user.id) {
							return action.payload.user;
						}
						return user;
					})
				]
			};
		case UserType.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user =>
						user.id !== action.payload.user.id)
				],
				count: state.count - 1,
			};
		default:
			return state;
	}
}

export default reducer;

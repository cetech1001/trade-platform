import {User, UserState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {UserType} from "../types";

const initialState: UserState = {
	list: [],
}

const reducer = (state = initialState, action: PayloadAction<{ user: User, users: User[] }>) => {
	switch (action.type) {
		case UserType.LIST:
			return { list: action.payload.users };
		case UserType.CREATE:
			return { list: [ ...state.list, action.payload.user ] };
		case UserType.UPDATE:
			return {
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
			return { list: [ ...state.list.filter(user => user.id !== action.payload.user.id) ] };
		default:
			return state;
	}
}

export default reducer;

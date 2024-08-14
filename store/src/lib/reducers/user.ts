import {UserState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {UserActions} from "../types";

const initialState: UserState = {
	count: 0,
	list: [],
	currentUser: null,
}

const reducer = (state = initialState, action: PayloadAction<UserState>) => {
	switch (action.type) {
		case UserActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case UserActions.CREATE:
			return {
				...state,
				list: [ ...state.list, action.payload.currentUser! ],
				count: state.count + 1,
			};
		case UserActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === state.currentUser?.id) {
							return action.payload.currentUser!;
						}
						return user;
					})
				]
			};
		case UserActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.currentUser?.id)
				],
				count: state.count - 1,
			};
		case UserActions.SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.payload.currentUser,
			}
		default:
			return state;
	}
}

export default reducer;

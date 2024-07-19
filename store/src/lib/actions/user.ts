import {AppDispatch} from "@coinvant/store";
import {UserService} from "../services";
import {UserType} from "../types";

export const fetchUsers = () => async (dispatch: AppDispatch) => {
	const users = await UserService.getUsers();
	dispatch({
		type: UserType.LIST,
		payload: {
			users,
		},
	});
}

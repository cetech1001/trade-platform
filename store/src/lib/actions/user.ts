import {AppDispatch} from "@coinvant/store";
import {UserService} from "../services";
import {UserType} from "../types";
import {PaginationOptions} from "@coinvant/types";

export const fetchUsers = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	const data = await UserService.getUsers(options);
	dispatch({
		type: UserType.LIST,
		payload: {
			list: data.items,
			count: data.meta.totalItems,
		},
	});
}

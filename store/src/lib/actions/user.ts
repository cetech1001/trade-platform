import {AppDispatch, showAlert} from "@coinvant/store";
import {UserService} from "../services";
import {UserActions} from "../types";
import {CreateUser, PaginationOptions, UpdateUser, User} from "@coinvant/types";

export const fetchUsers = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await UserService.getUsers(options);
		dispatch({
			type: UserActions.LIST,
			payload: {
				list: data.items,
				count: data.meta.totalItems,
			},
		});
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to fetch users.',
			type: 'error',
			show: true,
		}));
	}
}

export const addUser = (payload: CreateUser) => async (dispatch: AppDispatch) => {
	try {
		const data = await UserService.createUser(payload);
		dispatch({
			type: UserActions.CREATE,
			payload: {
				currentUser: data,
			},
		});
		dispatch(showAlert({
			message: 'User created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to create user.',
			type: 'error',
			show: true,
		}));
	}
}

export const editUser = (id: string, payload: UpdateUser) => async (dispatch: AppDispatch) => {
	try {
		const data = await UserService.updateUser(id, payload);
		dispatch({
			type: UserActions.UPDATE,
			payload: {
				currentUser: data,
			},
		});
		dispatch(showAlert({
			message: 'User updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to update user.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeUser = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await UserService.deleteUser(id);
		dispatch({
			type: UserActions.DELETE,
		});
		dispatch(showAlert({
			message: 'User deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		dispatch(showAlert({
			message: 'Failed to delete user.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentUser = (user: User) => async (dispatch: AppDispatch) => {
	dispatch({
		type: UserActions.SET_CURRENT_USER,
		payload: { currentUser: user },
	});
}

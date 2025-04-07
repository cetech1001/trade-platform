import { AppDispatch } from '../../index';
import { UserService } from '../services';
import { UserActions } from '../types';
import { CreateUser, KYC, PaginationOptions, UpdateUser, User } from '@coinvant/types';
import { getError } from '../helpers';
import { showAlert } from './alert';

export const fetchUsers = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await UserService.getUsers(options);
		dispatch({
			type: UserActions.LIST,
			payload: {
				list: data.items,
				totalUserCount: data.meta.totalItems,
        totalUserPages: data.meta.totalPages,
			},
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch users.',
			type: 'error',
			show: true,
		}));
	}
}

export const fetchKYC = (options?: PaginationOptions) => async (dispatch: AppDispatch) => {
	try {
		const data = await UserService.findKYC(options);
		dispatch({
			type: UserActions.KYC_LIST,
			payload: {
				kycList: data.items,
				totalKycCount: data.meta.totalItems,
        totalKycPages: data.meta.totalPages,
			},
		});
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to fetch KYC list.',
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
				highlightedUser: data,
			},
		});
		dispatch(showAlert({
			message: 'User created successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to create user.',
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
				highlightedUser: data,
			},
		});
		dispatch(showAlert({
			message: 'User updated successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
		const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to update user.',
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
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to delete user.',
			type: 'error',
			show: true,
		}));
	}
}

export const removeKYC = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await UserService.deleteKYC(id);
		dispatch({
			type: UserActions.DELETE_KYC,
		});
		dispatch(showAlert({
			message: 'KYC deleted successfully.',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to delete KYC.',
			type: 'error',
			show: true,
		}));
	}
}

export const setCurrentUser = (user: User) => async (dispatch: AppDispatch) => {
	dispatch({
		type: UserActions.SET_CURRENT_USER,
		payload: {
			highlightedUser: user,
		},
	});
}

export const setCurrentKYC = (kyc: KYC) => async (dispatch: AppDispatch) => {
	dispatch({
		type: UserActions.SET_CURRENT_KYC,
		payload: {
			highlightedKYC: kyc,
		},
	});
}

export const uploadKYC = (formData: FormData) => async (dispatch: AppDispatch) => {
	try {
		await UserService.uploadKYC(formData);
		dispatch(showAlert({
			message: 'We are verifying your information',
			type: 'success',
			show: true,
		}));
	} catch (error) {
    const { message } = getError(error);
		dispatch(showAlert({
			message: message || 'Failed to upload data.',
			type: 'error',
			show: true,
		}));
	}
}

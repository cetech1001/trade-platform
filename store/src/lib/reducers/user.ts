import { Account, AccountType, UserState } from '@coinvant/types';
import {PayloadAction} from "@reduxjs/toolkit";
import {UserActions} from "../types";

let currentAccount = null;
const _authData = localStorage.getItem("authData");
if (_authData) {
	const authData = JSON.parse(_authData);
	if (authData?.user?.accounts) {
		currentAccount = authData.user.accounts.find(({ type }: Account) =>
			type === AccountType.demo);
	}
}

const initialState: UserState = {
	count: 0,
	kycCount: 0,
	list: [],
	kycList: [],
	currentUser: null,
	currentKYC: null,
	currentAccount,
}

const reducer = (state = initialState, action: PayloadAction<UserState>) => {
	switch (action.type) {
		case UserActions.LIST:
			return {
				...state,
				list: action.payload.list,
				count: action.payload.count
			};
		case UserActions.KYC_LIST:
			return {
				...state,
				kycList: action.payload.kycList,
				kycCount: action.payload.kycCount,
			};
		case UserActions.CREATE:
			if (action.payload.currentUser) {
				return {
					...state,
					list: [ action.payload.currentUser, ...state.list ],
					count: state.count + 1,
				};
			}
			return state;
		case UserActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						if (user.id === state.currentUser?.id) {
							if (action.payload.currentUser) {
								return action.payload.currentUser;
							}
							return user;
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
		case UserActions.DELETE_KYC:
			return {
				...state,
				kycList: [
					...state.kycList.filter(kyc => kyc.id !== state.currentKYC?.id)
				],
				kycCount: state.kycCount - 1,
			};
		case UserActions.SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.payload.currentUser,
			}
		case UserActions.SET_CURRENT_KYC:
			return {
				...state,
				currentKYC: action.payload.currentKYC,
			}
		case UserActions.SET_CURRENT_ACCOUNT:
			return {
				...state,
				currentAccount: action.payload.currentAccount,
			}
		default:
			return state;
	}
}

export default reducer;

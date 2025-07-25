import { UserState } from '@coinvant/types';
import {PayloadAction} from "@reduxjs/toolkit";
import {UserActions} from "../types";

const initialState: UserState = {
	totalUserCount: 0,
  totalUserPages: 0,
	totalKycCount: 0,
  totalKycPages: 0,
	list: [],
	kycList: [],
	highlightedUser: null,
	highlightedKYC: null,
}

const reducer = (state = initialState, action: PayloadAction<UserState>) => {
	switch (action.type) {
		case UserActions.LIST:
			return {
				...state,
				list: action.payload.list,
				totalUserCount: action.payload.totalUserCount,
        totalUserPages: action.payload.totalUserPages
			};
		case UserActions.KYC_LIST:
			return {
				...state,
				kycList: action.payload.kycList,
				totalKycCount: action.payload.totalKycCount,
			};
		case UserActions.CREATE:
			if (action.payload.highlightedUser) {
				return {
					...state,
					list: [
            action.payload.highlightedUser,
            ...state.list.filter((_, i) => i < 9)
          ],
          totalUserCount: state.totalUserCount + 1,
				};
			}
			return state;
		case UserActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						return user.id === state.highlightedUser?.id
            && action.payload.highlightedUser
              ? action.payload.highlightedUser : user;
					})
				],
			};
		case UserActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.highlightedUser?.id)
				],
        totalUserCount: state.totalUserCount - 1,
			};
		case UserActions.DELETE_KYC:
			return {
				...state,
				kycList: [
					...state.kycList.filter(kyc => kyc.id !== state.highlightedKYC?.id)
				],
				totalKycCount: state.totalKycCount - 1,
			};
		case UserActions.SET_CURRENT_USER:
			return {
				...state,
				highlightedUser: action.payload.highlightedUser,
			}
		case UserActions.SET_CURRENT_KYC:
			return {
				...state,
				highlightedKYC: action.payload.highlightedKYC,
			}
		default:
			return state;
	}
}

export default reducer;

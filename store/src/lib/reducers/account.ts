import { AccountState } from '@coinvant/types';
import {PayloadAction} from "@reduxjs/toolkit";
import {AccountActions} from "../types";
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { getCurrentAccount } from '../helpers';

let selectedAccount = null;
const _authData = localStorage.getItem("authData");
if (_authData) {
  const bytes = CryptoJS.AES.decrypt(_authData, environment.encryptionKey || 'default-1');
  const authData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	if (authData?.user?.accounts) {
		selectedAccount = getCurrentAccount(authData.user.accounts) || null;
	}
}

const initialState: AccountState = {
	list: [],
	highlightedAccount: selectedAccount,
}

const reducer = (state = initialState, action: PayloadAction<AccountState>) => {
	switch (action.type) {
		case AccountActions.LIST:
			return {
				...state,
				list: action.payload.list,
			};
		case AccountActions.CREATE:
			if (action.payload.highlightedAccount) {
				return {
					...state,
					list: [
            action.payload.highlightedAccount,
            ...state.list.filter((_, i) => i < 9)
          ],
				};
			}
			return state;
		case AccountActions.UPDATE:
			return {
				...state,
				list: [
					...state.list.map(user => {
						return user.id === state.highlightedAccount?.id
            && action.payload.highlightedAccount
              ? action.payload.highlightedAccount : user;
					})
				],
			};
		case AccountActions.DELETE:
			return {
				...state,
				list: [
					...state.list.filter(user => user.id !== state.highlightedAccount?.id)
				],
			};
		case AccountActions.SET_CURRENT_ACCOUNT:
			return {
				...state,
				highlightedAccount: action.payload.highlightedAccount,
			}
		default:
			return state;
	}
}

export default reducer;

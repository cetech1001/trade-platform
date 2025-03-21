import { AuthState } from '@coinvant/types';
import {PayloadAction} from "@reduxjs/toolkit";
import {AuthActions} from "../types";
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';


let initialState: AuthState = {
  user: null,
  accessToken: '',
};

const _authData = localStorage.getItem("authData");
if (_authData) {
  const bytes = CryptoJS.AES.decrypt(_authData, environment.encryptionKey || 'default-1');
  initialState = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const reducer = (state = initialState, action: PayloadAction<AuthState>) => {
  const { type, payload } = action;

  switch (type) {
    case AuthActions.LOGIN:
      return {
        user: payload.user,
        accessToken: payload.accessToken
      };
    case AuthActions.LOGOUT:
      return { user: null, accessToken: '' };
    default:
      return state;
  }
}

export default reducer;

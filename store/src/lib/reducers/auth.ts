import { AuthState } from '@coinvant/types';
import {PayloadAction} from "@reduxjs/toolkit";
import {AuthActions} from "../types";

const _authData = localStorage.getItem("authData");

const initialState: AuthState = _authData ? JSON.parse(_authData) : {
  user: null,
  accessToken: '',
};

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

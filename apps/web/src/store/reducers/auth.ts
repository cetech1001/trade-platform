import {AuthState} from "@coinvant/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {AuthType} from "../types";

const initialState: AuthState = {
  user: null,
  accessToken: '',
}

const reducer = (state = initialState, action: PayloadAction<AuthState>) => {
  const { type, payload } = action;

  switch (type) {
    case AuthType.LOGIN:
      return { user: payload.user, accessToken: payload.accessToken };
    case AuthType.LOGOUT:
      return { user: null, accessToken: '' };
    default:
      return state;
  }
}

export default reducer;

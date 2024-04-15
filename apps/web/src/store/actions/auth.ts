import {AuthService} from "../services";
import {LoginRequest, RegisterRequest} from "@coinvant/types";
import {AppDispatch} from "../index";
import {AuthType} from "../types";

export const login = (payload: LoginRequest) => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthService.login(payload);
    dispatch({
      type: AuthType.LOGIN,
      payload: response,
    });
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const register = (payload: RegisterRequest) => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthService.register(payload);
    dispatch({
      type: AuthType.LOGIN,
      payload: response,
    });
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: AuthType.LOGOUT,
  });
}

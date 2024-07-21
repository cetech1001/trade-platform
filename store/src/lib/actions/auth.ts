import {AuthService} from "../services";
import {LoginRequest, LoginResponse, RegisterRequest} from "@coinvant/types";
import {AppDispatch, showAlert} from "../../index";
import {AuthActions} from "../types";
import {getError} from "../helpers";

const authenticate = async (payload: LoginRequest | RegisterRequest, actionType: 'login' | 'register', dispatch: AppDispatch) => {
  try {
    let response: LoginResponse;

    if (actionType === "login") {
      response = await AuthService.login(payload as LoginRequest);
    } else {
      response = await AuthService.register(payload as RegisterRequest);
    }

    localStorage.setItem('authData', JSON.stringify(response));

    dispatch({
      type: AuthActions.LOGIN,
      payload: response,
    });

    return Promise.resolve();
  } catch (error) {
    const { message, status } = getError(error);

    if (status === 401) {
      dispatch(showAlert({
        message: 'Invalid login details.',
        type: 'error',
        show: true,
      }));
    } else {
      dispatch(showAlert({
        message,
        type: 'error',
        show: true,
      }));
    }

    throw error;
  }
}

export const login = (payload: LoginRequest) => async (dispatch: AppDispatch) => {
  return authenticate(payload, 'login', dispatch);
}

export const register = (payload: RegisterRequest) => async (dispatch: AppDispatch) => {
  return authenticate(payload, 'register', dispatch);
}

export const logout = () => async (dispatch: AppDispatch) => {
  localStorage.removeItem('authData');
  dispatch({
    type: AuthActions.LOGOUT,
  });
}

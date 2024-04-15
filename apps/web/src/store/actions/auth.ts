import {AuthService} from "../services";
import {LoginRequest, RegisterRequest} from "@coinvant/types";
import {AppDispatch, showAlert} from "../index";
import {AuthType} from "../types";
import {getError} from "../../helpers";

export const login = (payload: LoginRequest) => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthService.login(payload);
    dispatch({
      type: AuthType.LOGIN,
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
  }
}

export const register = (payload: RegisterRequest) => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthService.register(payload);
    dispatch(showAlert({
      message: 'Account created successfully.',
      type: 'success',
      show: true,
    }));
    dispatch({
      type: AuthType.LOGIN,
      payload: response,
    });
    return Promise.resolve(response);
  } catch (error) {
    const { message } = getError(error);
    dispatch(showAlert({
      message,
      type: 'error',
      show: true,
    }));
  }
}

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: AuthType.LOGOUT,
  });
}

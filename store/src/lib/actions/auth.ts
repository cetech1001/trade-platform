import * as CryptoJS from 'crypto-js';
import { AuthService } from '../services';
import { LoginRequest, LoginResponse, RegisterRequest } from '@coinvant/types';
import { AppDispatch, sendOTP, setCurrentAccount, showAlert } from '../../index';
import { AuthActions } from '../types';
import { getDemoAccount, getError } from '../helpers';
import { environment } from '../../environments/environment';

const authenticate = async (payload: LoginRequest | RegisterRequest, actionType: 'login' | 'register', dispatch: AppDispatch) => {
  try {
    let response: LoginResponse;

    if (actionType === "login") {
      response = await AuthService.login(payload as LoginRequest);
    } else {
      response = await AuthService.register(payload as RegisterRequest);
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(response),
      environment.encryptionKey || 'default-1'
    ).toString();
    localStorage.setItem('userData', encrypted);

    localStorage.setItem('email', payload.email);

    return dispatch(sendOTP(payload.email));
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

    return Promise.reject(message);
  }
}

export const completeAuth = () => (dispatch: AppDispatch) => {
  try {
    const encrypted = localStorage.getItem('userData');
    if (!encrypted) {
      const message = 'Missing auth data';
      dispatch(showAlert({
        message,
        type: 'error',
        show: true,
      }));
      return Promise.reject(message);
    }

    const bytes = CryptoJS.AES.decrypt(encrypted, environment.encryptionKey || 'default-1');
    const response = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    localStorage.removeItem('userData');
    localStorage.removeItem('email');
    localStorage.setItem('authData', encrypted);

    dispatch({
      type: AuthActions.LOGIN,
      payload: response,
    });

    dispatch(setCurrentAccount(getDemoAccount(response.user.accounts)));

    return Promise.resolve();
  } catch (error) {
    const { message } = getError(error);

    dispatch(showAlert({
      message,
      type: 'error',
      show: true,
    }));

    return Promise.reject(message);
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

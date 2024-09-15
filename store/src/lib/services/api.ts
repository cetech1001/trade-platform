import axios from 'axios';
import {environment} from "../../../environments/environment";
import store, {AppDispatch} from "../../index";
import {logout} from '../actions';

export const api = axios.create({
  baseURL: environment.api.baseURL,
});

api.interceptors.request.use(
  async (config) => {
    const _authData = localStorage.getItem('authData');
    if (_authData) {
      const { access_token } = JSON.parse(_authData);
      if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const dispatch = store.dispatch as AppDispatch;
            dispatch(logout());
        }
        return Promise.reject(error);
    }
);

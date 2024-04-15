import axios from 'axios';
import {environment} from "../../environment/environment";

export const api = axios.create({
  baseURL: environment.api.baseURL,
});

api.interceptors.request.use(
  async (config) => {
    const _authData = localStorage.getItem('authData');
    if (_authData) {
      const { accessToken } = JSON.parse(_authData);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

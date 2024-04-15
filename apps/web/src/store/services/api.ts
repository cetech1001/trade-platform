import axios from 'axios';
import {environment} from "../../environment/environment";

export const api = axios.create({
  baseURL: environment.api.baseURL,
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import { axiosInstance } from './axiosInstance';
import {  AxiosError } from 'axios';
import TokenConfig from '../../utils/tokenConfig';
import { logoutUser } from '../../store/authActions';
import { store } from '../../store/store';

export const configureInterceptors = () => {
  axiosInstance.interceptors.request.use(async (config) => {
    if (config.url && config.url === '/auth/signin') {
      return config;
    }

    const token = await TokenConfig.refreshToken();
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const isLoggedIn = Boolean(TokenConfig.getToken());

      if (
        error.response?.status === 401 &&
        isLoggedIn &&
        error.request.url !== '/user/logout'
      ) {
        store.dispatch(logoutUser());
        return error;
      }
      throw error;
    }
  );
};

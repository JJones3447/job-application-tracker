import axios from 'axios';
import { getAuthToken } from './tokenStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message;

    if (
      status === 401 &&
      logoutHandler &&
      message !== 'Invalid email or password'
    ) {
      logoutHandler();
    }

    const err = new Error(message || 'Something went wrong');
    err.status = status;
    err.details = error.response?.data?.error?.details;

    return Promise.reject(err);
  }
);

export default apiClient;
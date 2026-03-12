import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.210:3000';

let logoutHandler = null;

export const setLogoutHandler = handler => {
  logoutHandler = handler;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && logoutHandler) {
      await AsyncStorage.removeItem('token');
      logoutHandler();
    }

    const err = new Error(
      error.response?.data?.error?.message || 'Something went wrong'
    );

    err.status = error.response?.status;
    err.details = error.response?.data?.error?.details;

    return Promise.reject(err);
  }
);

export default apiClient;
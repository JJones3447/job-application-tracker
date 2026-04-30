import { post, get } from '../client/request';

export const login = (credentials) =>
  post('/authentication/login', credentials);

export const register = (userData) =>
  post('/authentication/register', userData);

export const getMe = () =>
  get('/authentication/me');
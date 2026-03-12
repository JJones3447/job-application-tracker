import apiClient from '../client/client';

export const login = async (credentials) => {
  const response = await apiClient.post('/authentication/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/authentication/register', userData);
  return response.data;
};
import AsyncStorage from '@react-native-async-storage/async-storage';

let authToken = null;

export const getAuthToken = () => authToken;

export const loadStoredToken = async () => {
  authToken = await AsyncStorage.getItem('token');
  return authToken;
};

export const setAuthToken = async token => {
  authToken = token;
  await AsyncStorage.setItem('token', token);
};

export const clearAuthToken = async () => {
  authToken = null;
  await AsyncStorage.removeItem('token');
};
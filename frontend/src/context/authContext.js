import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login as loginApi, getMe} from '../api/auth/authApi';
import {setLogoutHandler} from '../api/client/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  const logout = async () => {
    try {
      setAuthenticating(true);
      await AsyncStorage.removeItem('token');
      setUserToken(null);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 150));
      setAuthenticating(false);
    }
  
  };

  const login = async (email, password) => {
    try {
      setAuthenticating(true);
      const data = await loginApi({ email, password });
      await AsyncStorage.setItem('token', data.token);
      setUserToken(data.token);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 150));
      setAuthenticating(false);
    }
    
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await getMe();
      setUserToken(token);
    } catch {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLogoutHandler(logout);
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, login, logout, loading, authenticating }}
    >
      {children}
    </AuthContext.Provider>
  );
}
import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, {setLogoutHandler} from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    await AsyncStorage.setItem('token', data.token);
    setUserToken(data.token);
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await api.getMe();
      setUserToken(token);
    } catch {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔥 Register global logout handler
    setLogoutHandler(logout);

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
import { createContext, useEffect, useState, useCallback } from 'react';
import { login as loginApi, getMe } from '../api/auth/authApi';
import { setLogoutHandler } from '../api/client/client';
import {
  loadStoredToken,
  setAuthToken,
  clearAuthToken,
} from '../api/client/tokenStorage';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  const logout = useCallback(async () => {
    try {
      setAuthenticating(true);
      await clearAuthToken();
      queryClient.clear();
      setUserToken(null);
    } finally {
      setAuthenticating(false);
    }
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      setAuthenticating(true);

      const data = await loginApi({ email, password });

      await setAuthToken(data.token);
      await getMe();

      setUserToken(data.token);

      return data;
    } catch (error) {
      await clearAuthToken();
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  const checkAuth = async () => {
    const token = await loadStoredToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await getMe();
      setUserToken(token);
    } catch (error) {
      await clearAuthToken();
      queryClient.clear();
      setUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);
  useEffect(() => {
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
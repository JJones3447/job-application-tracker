import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const login = async (email, password) => {
        const data = await api.login({email, password});
        await AsyncStorage.setItem('token', data.token);
        setUserToken(data.token);
    };
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUserToken(null);
    };
    const checkAuth = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token){setUserToken(token);}
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return(
        <AuthContext.Provider value={{userToken, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}
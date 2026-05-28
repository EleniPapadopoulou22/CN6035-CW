import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await tokenStorage.get('user');
      const accessToken = await tokenStorage.get('accessToken');

      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('No stored user found');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email, password) {
    const response = await authApi.login(email, password);
    const { user: userData, accessToken, refreshToken } = response.data.data;

    await tokenStorage.set('accessToken', accessToken);
    await tokenStorage.set('refreshToken', refreshToken);
    await tokenStorage.set('user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  }

  async function register(name, email, password) {
    await authApi.register(name, email, password);
    return login(email, password);
  }

  async function logout() {
    await tokenStorage.remove('accessToken');
    await tokenStorage.remove('refreshToken');
    await tokenStorage.remove('user');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '@/services/auth/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = authService.getUser();
      if (savedUser) {
        const isValid = await authService.validateToken();
        if (isValid) {
          setUser(savedUser);
        } else {
          authService.logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (email, password) => {
    const result = await authService.register(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const loginWithGoogle = async (googleUserInfo) => {
    const result = await authService.loginWithGoogle(googleUserInfo);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
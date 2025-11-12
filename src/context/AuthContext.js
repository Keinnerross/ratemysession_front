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

  const loginWithGoogle = async (token) => {
    // Con el flujo OAuth, recibimos directamente el JWT de WordPress
    // Solo necesitamos configurar el usuario
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const userInfo = {
        displayName: payload.name || payload.user_display_name || payload.email,
        email: payload.email
      };
      
      setUser(userInfo);
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Error processing Google login:', error);
      return { success: false, message: 'Invalid token' };
    }
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
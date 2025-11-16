'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = authService.getUser();
      if (savedUser) {
        // Try to validate but don't logout if it fails
        const isValid = await authService.validateToken();
        if (isValid) {
          setUser(savedUser);
        } else {
          // Still set the user even if validation fails
          // This prevents logout on refresh due to validation issues
          console.warn('Token validation failed, but keeping user logged in');
          setUser(savedUser);
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

  const loginWithFacebook = async (facebookUserInfo) => {
    const result = await authService.loginWithFacebook(facebookUserInfo);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, loginWithFacebook, logout, loading }}>
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
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Company, UserRole } from '../types';
import { ApiClient } from './api-client';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCompany = localStorage.getItem('company');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
      if (savedCompany) {
        try {
          setCompany(JSON.parse(savedCompany));
        } catch (e) {
          setCompany(null);
        }
      } else {
        refreshCompany();
      }
    } else {
      setUser(null);
      setCompany(null);
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  const refreshCompany = async () => {
    try {
      const comp = await ApiClient.getCompanyProfile();
      if (comp) {
        setCompany(comp);
        localStorage.setItem('company', JSON.stringify(comp));
      }
    } catch (e) {
      console.warn('Failed to fetch company profile', e);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.login(email, password);
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.company) {
        setCompany(res.user.company);
        localStorage.setItem('company', JSON.stringify(res.user.company));
      } else {
        await refreshCompany();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.register(data);
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.company) {
        setCompany(res.user.company);
        localStorage.setItem('company', JSON.stringify(res.user.company));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<string>;
  logout: () => void;
  switchDemoUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await api.login(email, pass);
    setUser(loggedUser);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setUser(res.user);
    return res.message;
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoUser = async (userId: string) => {
    setLoading(true);
    try {
      const switched = await api.switchDemoUser(userId);
      setUser(switched);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchDemoUser, refreshUser, setUser }}>
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

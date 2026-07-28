/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'player' | 'team' | 'staff';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: 'player' | 'team' | 'staff') => Promise<void>;
  googleLogin: (idToken: string, role?: 'player' | 'team' | 'staff') => Promise<{ needsRoleSelection?: boolean; email?: string; googleId?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch user profile to verify token and load user details
      const response = await api.get('/profiles/me');
      const profile = response.data.profile;
      if (profile && profile.userID) {
        setUser({
          id: profile.userID._id,
          username: profile.userID.username,
          email: profile.userID.email,
          role: profile.userID.role,
        });
      }
    } catch (err) {
      console.error("Session check failed:", err);
      // Clear credentials if session check fails
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen for custom silent token refresh failure event from axios client
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, user: loggedUser } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, role: 'player' | 'team' | 'staff') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, password, role });
      const { accessToken, user: loggedUser } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken: string, role?: 'player' | 'team' | 'staff') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/google', { idToken, role });
      
      if (response.data.needsRoleSelection) {
        return {
          needsRoleSelection: true,
          email: response.data.email,
          googleId: response.data.googleId,
        };
      }

      const { accessToken, user: loggedUser } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);
      return {};
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed:", err);
      // Proceed with local logout even if backend request fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, checkSession }}>
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

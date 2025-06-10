import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const socialLogin = async (provider, token) => {
    try {
      const response = await axios.post(`/api/auth/${provider}`, { token });
      const { token: authToken, user } = response.data;
      localStorage.setItem('token', authToken);
      setUser(user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to login with ${provider}`);
      throw error;
    }
  };

  const googleLogin = async (token) => {
    return socialLogin('google', token);
  };

  const githubLogin = async (token) => {
    return socialLogin('github', token);
  };

  const microsoftLogin = async (token) => {
    return socialLogin('microsoft', token);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    githubLogin,
    microsoftLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
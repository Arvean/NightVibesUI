import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../axiosInstance';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, initialState = {} }) => {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    ...initialState
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Set the token in axios headers
      axiosInstance.setAuthToken(token);

      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false
        }));
      } else {
        // If we have a token but no user data, fetch the profile
        try {
          const response = await authAPI.getProfile();
          const user = response.data;
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false
          }));
        } catch (profileError) {
          // If profile fetch fails, clear tokens and log out
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
          axiosInstance.clearAuthToken();
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to restore authentication state',
        isLoading: false
      }));
    }
  };

  const login = async (email, password) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authAPI.login({ email, password });
      const { access, refresh, user } = response.data;
      
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers
      axiosInstance.setAuthToken(access);

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to login';
      setState(prev => ({
        ...prev,
        error: message,
        isLoading: false
      }));
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;

      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers
      axiosInstance.setAuthToken(access);

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to register';
      setState(prev => ({
        ...prev,
        error: message,
        isLoading: false
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Clear tokens
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
      
      // Clear axios auth header
      axiosInstance.clearAuthToken();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to logout',
        isLoading: false
      }));
      return false;
    }
  };

  const updateUser = async (updates) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authAPI.updateProfile(updates);
      const updatedUser = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Update user error:', error);
      const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile';
      setState(prev => ({
        ...prev,
        error: message,
        isLoading: false
      }));
      return false;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshToken);
      const { access } = response.data;
      
      await AsyncStorage.setItem('access_token', access);
      axiosInstance.setAuthToken(access);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, log out the user
      logout();
      return false;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    refreshAuthToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
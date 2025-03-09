// Import necessary modules from React and React Native.
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import AsyncStorage for persistent storage.
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the axios instance for making API requests.
import axiosInstance from '../axiosInstance';
// Import the authentication-related API endpoints.
import { authAPI } from '../api';

// Create a context for authentication.
const AuthContext = createContext(null);

// Custom hook to access the authentication context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Component to provide authentication context to its children.
export const AuthProvider = ({ children, initialState = {} }) => {
  // Define the state for authentication.
  const [state, setState] = useState({
    user: null, // Stores the user object.
    isAuthenticated: false, // Boolean to check if the user is authenticated.
    isLoading: true, // Boolean to indicate loading state.
    error: null, // Stores any authentication errors.
    ...initialState // Allows for initial state to be passed in
  });

  // Check authentication status on component mount.
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check if the user is authenticated.
  const checkAuth = async () => {
    try {
      // Retrieve the access token from AsyncStorage.
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        // If no token is found, set loading to false and return.
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Set the token in axios headers for subsequent requests.
      axiosInstance.setAuthToken(token);

      // Retrieve user data from AsyncStorage.
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        // If user data exists, parse it and update the state.
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

  // Function to handle user login.
  const login = async (email, password) => {
    try {
      // Set loading to true and clear any previous errors.
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Call the login API endpoint.
      const response = await authAPI.login({ email, password });
      const { access, refresh, user } = response.data;

      // Store the access token, refresh token, and user data in AsyncStorage.
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers.
      axiosInstance.setAuthToken(access);

      // Update the authentication state.
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

  // Function to handle user registration.
  const register = async (userData) => {
    try {
      // Set loading to true and clear any previous errors.
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Call the register API endpoint.
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;

      // Store the access token, refresh token and user data in AsyncStorage.
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers.
      axiosInstance.setAuthToken(access);

      // Update the authentication state.
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

  // Function to handle user logout.
  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Clear tokens and user data from AsyncStorage.
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');

      // Clear axios auth header
      axiosInstance.clearAuthToken();

      // Reset the authentication state.
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

    // Function to update user data
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
    }

  // Function to refresh the authentication token.
  const refreshAuthToken = async () => {
    try {
      // Retrieve the refresh token from AsyncStorage.
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call the refresh token API endpoint.
      const response = await authAPI.refreshToken(refreshToken);
      const { access } = response.data;

      // Store the new access token in AsyncStorage.
      await AsyncStorage.setItem('access_token', access);
      axiosInstance.setAuthToken(access);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, log out the user.
      logout();
      return false;
    }
  };

  // Function to clear any authentication errors.
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Define the context value.
  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    refreshAuthToken,
    clearError
  };

  // Provide the authentication context to children components.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthContext.
export default AuthContext;

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const setupAxiosInterceptors = () => {
      api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // If error is not 401 or request has already been retried
          if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await api.post('/token/refresh/', {
              refresh: refreshToken,
            });

            const { access } = response.data;
            
            // Update stored token
            await AsyncStorage.setItem('access_token', access);
            setUserToken(access);
            
            // Update authorization header
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            return api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout user
            await logout();
            return Promise.reject(refreshError);
          }
        }
      );
    };

    setupAxiosInterceptors();
  }, []);

  const register = async (username, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/register/', {
        username,
        email,
        password,
      });

      // Auto-login after successful registration
      await login(username, password);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Decode token to get user info
      const decodedToken = jwtDecode(access);
      const userInfo = {
        username: decodedToken.username,
        email: decodedToken.email,
        userId: decodedToken.user_id,
      };

      // Store tokens and user info
      await AsyncStorage.multiSet([
        ['access_token', access],
        ['refresh_token', refresh],
        ['user_info', JSON.stringify(userInfo)],
      ]);

      // Update state
      setUserToken(access);
      setUserInfo(userInfo);

      // Setup authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear stored data
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_info',
      ]);

      // Clear state
      setUserToken(null);
      setUserInfo(null);
      setError(null);

      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check token validity
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [[, token], [, userInfoStr]] = await AsyncStorage.multiGet([
          'access_token',
          'user_info',
        ]);

        if (token && isTokenValid(token)) {
          setUserToken(token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          if (userInfoStr) {
            setUserInfo(JSON.parse(userInfoStr));
          }
        } else {
          // Token is invalid or expired, try to refresh
          const refreshToken = await AsyncStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await api.post('/token/refresh/', {
                refresh: refreshToken,
              });
              
              const { access } = response.data;
              await AsyncStorage.setItem('access_token', access);
              setUserToken(access);
              api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            } catch {
              // If refresh fails, clear everything
              await logout();
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

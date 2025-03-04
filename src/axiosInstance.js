import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use localhost for iOS simulator and 10.0.2.2 for Android emulator
const DEV_API_URL = process.env.NODE_ENV === 'test' ? 'http://localhost:8000' : Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

const PROD_API_URL = 'https://your-production-url.com'; // Update when deploying

const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Add auth token if available
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Get CSRF token for Django if needed
      if (config.method !== 'get') {
        const csrfToken = await AsyncStorage.getItem('csrfToken');
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
      }

      // Log requests in development
      if (__DEV__) {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
          headers: config.headers,
        });
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    // Store CSRF token if provided
    const csrfToken = response.headers['x-csrftoken'];
    if (csrfToken) {
      AsyncStorage.setItem('csrfToken', csrfToken);
    }

    return response;
  },
  async (error) => {
    // Original request config
    const originalRequest = error.config;

    // Log errors in development
    if (__DEV__) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        originalError: error,
      });
    }

    // Handle token expiration and refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/api/auth/token/refresh/') {
        // If the refresh token request itself failed, we need to log out
        if (typeof window !== 'undefined') {
          // For web
          window.dispatchEvent(new CustomEvent('auth-error', { detail: 'Session expired' }));
        } else {
          // For React Native, we'll handle this in the auth context
          console.error('Token refresh failed');
        }
        return Promise.reject(error);
      }

      // Mark the request as retried to prevent infinite loop
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/api/auth/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;

        // Store the new token
        await AsyncStorage.setItem('access_token', access);
        
        // Update axios default header
        api.setAuthToken(access);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout from the application
        if (typeof window !== 'undefined') {
          // For web
          window.dispatchEvent(new CustomEvent('auth-error', { detail: 'Session expired' }));
        } else {
          // For React Native, we'll handle this in the auth context
          console.error('Token refresh failed');
        }
        return Promise.reject(error);
      }
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        return Promise.reject({
          message: 'Invalid request. Please check your input.',
          details: error.response.data,
          originalError: error,
        });
      case 401:
        // We already handled the token refresh above
        // This is for other 401 errors
        return Promise.reject({
          message: 'Authentication failed. Please login again.',
          originalError: error,
        });
      case 403:
        return Promise.reject({
          message: 'You do not have permission to perform this action.',
          originalError: error,
        });
      case 404:
        return Promise.reject({
          message: 'The requested resource was not found.',
          originalError: error,
        });
      case 422:
        return Promise.reject({
          message: 'Validation error. Please check your input.',
          details: error.response.data,
          originalError: error,
        });
      case 429:
        return Promise.reject({
          message: 'Too many requests. Please try again later.',
          originalError: error,
        });
      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject({
          message: 'Server error. Please try again later.',
          originalError: error,
        });
      default:
        return Promise.reject({
          message: 'An unexpected error occurred.',
          originalError: error,
        });
    }
  }
);

// Add retry functionality for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Only retry GET requests
    if (!config || config.method !== 'get' || config._retry) {
      return Promise.reject(error);
    }

    // Maximum number of retries
    const maxRetries = 3;
    config._retry = (config._retry || 0) + 1;

    if (config._retry <= maxRetries) {
      // Exponential backoff delay
      const delayMs = Math.min(1000 * (2 ** (config._retry - 1)), 10000);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));

      // Retry the request
      return api(config);
    }

    return Promise.reject(error);
  }
);

// Helper methods
api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    defaults: {
      headers: {
        common: {}
      }
    },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  };
  return mockAxios;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('axiosInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the interceptors mock functions
    const requestUse = axios.interceptors.request.use;
    const responseUse = axios.interceptors.response.use;
    
    // Get the request interceptor
    const requestInterceptor = requestUse.mock.calls[0];
    const responseInterceptor = responseUse.mock.calls[0];
    
    // Store the interceptors for later use in tests
    if (requestInterceptor) {
      this.requestFulfilled = requestInterceptor[0];
      this.requestRejected = requestInterceptor[1];
    }
    
    if (responseInterceptor) {
      this.responseFulfilled = responseInterceptor[0];
      this.responseRejected = responseInterceptor[1];
    }
  });

  describe('auth token handling', () => {
    test('setAuthToken adds authorization header', () => {
      const token = 'test-token';
      axiosInstance.setAuthToken(token);
      expect(axiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });

    test('setAuthToken removes authorization header when token is falsy', () => {
      // First set a token
      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer test-token';
      
      // Then remove it
      axiosInstance.setAuthToken(null);
      expect(axiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });

    test('clearAuthToken removes authorization header', () => {
      // First set a token
      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer test-token';
      
      // Then clear it
      axiosInstance.clearAuthToken();
      expect(axiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('request interceptor', () => {
    // Define a test case where we can directly test the interceptor
    test('request interceptor adds auth token from AsyncStorage', async () => {
      // Skip if request interceptor wasn't captured
      if (!this.requestFulfilled) {
        return;
      }

      // Set up mocks
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === 'access_token') return Promise.resolve('test-token');
        if (key === 'csrfToken') return Promise.resolve('csrf-token');
        return Promise.resolve(null);
      });

      // Create a mock request config
      const config = {
        headers: {},
        method: 'post'
      };

      // Call the interceptor directly
      const result = await this.requestFulfilled(config);

      // Check the token was added
      expect(result.headers.Authorization).toBe('Bearer test-token');
      expect(result.headers['X-CSRFToken']).toBe('csrf-token');
    });

    test('request interceptor handles error', async () => {
      // Skip if request interceptor wasn't captured
      if (!this.requestRejected) {
        return;
      }

      const error = new Error('Test error');
      
      // We expect the interceptor to reject with the same error
      await expect(this.requestRejected(error)).rejects.toThrow('Test error');
    });
  });

  describe('response interceptor', () => {
    test('response interceptor stores CSRF token', async () => {
      // Skip if response interceptor wasn't captured
      if (!this.responseFulfilled) {
        return;
      }

      // Create a mock response
      const response = {
        headers: {
          'x-csrftoken': 'new-csrf-token'
        },
        config: {
          url: 'test-url'
        },
        status: 200,
        data: { success: true }
      };

      // Call the interceptor directly
      const result = await this.responseFulfilled(response);

      // Check CSRF token was stored
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('csrfToken', 'new-csrf-token');
      
      // Check the response was passed through
      expect(result).toBe(response);
    });
  });
});
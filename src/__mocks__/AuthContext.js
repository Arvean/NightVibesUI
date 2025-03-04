import React from 'react';

// Create a mutable state that can be updated by the mock
let authState = {
  isLoading: false,
  userToken: 'mock-token',
  userInfo: {
    username: 'testuser',
    email: 'test@example.com',
    userId: 'test-user-id'
  },
  error: null,
  // Mock functions that actually update the state for testing
  login: jest.fn(async (email, password) => {
    try {
      // Update auth state to simulate successful login
      authState.isLoading = false;
      authState.userToken = 'mock-access-token';
      authState.error = null;
      return {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token'
      };
    } catch (error) {
      // Update auth state to simulate failed login
      authState.isLoading = false;
      authState.userToken = null;
      authState.userInfo = null;
      authState.error = error.message;
      throw error;
    }
  }),
  register: jest.fn(async (username, email, password) => {
    try {
      // Update auth state to simulate successful registration
      authState.isLoading = false;
      authState.userToken = 'mock-access-token';
      authState.error = null;
      return {};
    } catch (error) {
      // Update auth state to simulate failed registration
      authState.isLoading = false;
      authState.userToken = null;
      authState.userInfo = null;
      authState.error = error.message;
      throw error;
    }
  }),
  logout: jest.fn(async () => {
    // Update auth state to simulate logout
    authState.isLoading = false;
    authState.userToken = null;
    authState.userInfo = null;
    authState.error = null;
    return {};
  }),
};

// Export a resettable default state
export const defaultAuthState = {
  isLoading: false,
  userToken: 'mock-token',
  userInfo: {
    username: 'testuser',
    email: 'test@example.com',
    userId: 'test-user-id'
  },
  error: null,
  login: jest.fn().mockResolvedValue({
    access: 'mock-access-token',
    refresh: 'mock-refresh-token'
  }),
  register: jest.fn().mockResolvedValue({}),
  logout: jest.fn().mockResolvedValue({}),
};

// Create the context with initial state
export const AuthContext = React.createContext(authState);

// Create a provider that can be used to inject custom state
export const AuthProvider = ({ children, value }) => {
  // Merge provided value with current state
  const mergedValue = value ? { ...authState, ...value } : authState;
  
  return (
    <AuthContext.Provider value={mergedValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock hook for easy access to the context
export const useAuth = jest.fn(() => authState);

// Helper to reset auth state for tests
export const resetAuthState = () => {
  authState = { ...defaultAuthState };
  // Reconfigure mocks
  authState.login = jest.fn(async (email, password) => {
    try {
      authState.userToken = 'mock-access-token';
      return { access: 'mock-access-token', refresh: 'mock-refresh-token' };
    } catch (error) {
      throw error;
    }
  });
  authState.register = jest.fn(async () => {
    try {
      authState.userToken = 'mock-access-token';
      return {};
    } catch (error) {
      throw error;
    }
  });
  authState.logout = jest.fn(async () => {
    authState.userToken = null;
    authState.userInfo = null;
    return {};
  });
};

// Default export for module mocking
export default {
  AuthContext,
  AuthProvider,
  useAuth,
  defaultAuthState,
  resetAuthState,
};
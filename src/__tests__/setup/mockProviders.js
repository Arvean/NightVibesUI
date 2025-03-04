import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Remove NavigationContainer as it causes problems in tests
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

export const defaultThemeState = {
  theme: 'light',
  isDark: false,
  colors: {
    background: '#ffffff',
    surface: '#f9fafb',
    surfaceHighlight: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    borderHighlight: '#d1d5db',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#60a5fa',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
    overlay: 'rgba(0, 0, 0, 0.5)',
    skeletonBase: '#e5e7eb',
    skeletonHighlight: '#f3f4f6',
  },
  setTheme: jest.fn()
};

export const defaultNavigationState = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  getState: jest.fn(() => ({})),
  getParent: jest.fn(() => null),
  setParams: jest.fn(),
};

// Create a NavigationContext mock
const NavigationContext = React.createContext(defaultNavigationState);

export const MockProviders = ({ children, authState = {}, themeState = {}, navigationState = {} }) => {
  const mergedAuthState = { ...defaultAuthState, ...authState };
  const mergedThemeState = { ...defaultThemeState, ...themeState };
  const mergedNavigationState = { ...defaultNavigationState, ...navigationState };

  // Remove debug logging
  // console.log('MockProviders - mergedAuthState:', mergedAuthState);
  // console.log('MockProviders - mergedThemeState:', mergedThemeState);

  return (
    <NavigationContext.Provider value={mergedNavigationState}>
      <ThemeProvider value={mergedThemeState}>
        <AuthProvider value={mergedAuthState}>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </NavigationContext.Provider>
  );
};
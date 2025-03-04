import React from 'react';

const lightColors = {
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
};

const darkColors = {
  background: '#181818',
  surface: '#222222',
  surfaceHighlight: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary: '#888888',
  border: '#333333',
  borderHighlight: '#444444',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeletonBase: '#2a2a2a',
  skeletonHighlight: '#333333',
};

// Initial state with dark mode support
let mockThemeState = {
  theme: 'light',
  isDark: false,
  colors: lightColors,
  setTheme: jest.fn((theme) => {
    // When tests call setTheme, actually update the mockThemeState
    if (theme === 'dark') {
      mockThemeState.theme = 'dark';
      mockThemeState.isDark = true;
      mockThemeState.colors = darkColors;
    } else {
      mockThemeState.theme = 'light';
      mockThemeState.isDark = false;
      mockThemeState.colors = lightColors;
    }
    return Promise.resolve();
  }),
};

// Set up context and provider
export const ThemeContext = React.createContext(mockThemeState);

export const ThemeProvider = ({ children, value }) => {
  // If tests provide a value, merge it with the current state
  const mergedValue = value ? { ...mockThemeState, ...value } : mockThemeState;
  
  return (
    <ThemeContext.Provider value={mergedValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook implementation for tests
export const useTheme = jest.fn(() => mockThemeState);

// Create a utility to reset the theme state
export const resetThemeState = () => {
  mockThemeState = {
    ...mockThemeState,
    theme: 'light',
    isDark: false,
    colors: lightColors,
  };
};

// Export default for module mocking
export default {
  ThemeContext,
  ThemeProvider,
  useTheme,
  resetThemeState,
};
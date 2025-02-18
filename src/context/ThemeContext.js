import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, theme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme) {
        setTheme(savedTheme);
        setIsDark(
          savedTheme === 'system'
            ? systemColorScheme === 'dark'
            : savedTheme === 'dark'
        );
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemePreference = async (newTheme) => {
    try {
      await AsyncStorage.setItem('theme_preference', newTheme);
      setTheme(newTheme);
      setIsDark(
        newTheme === 'system'
          ? systemColorScheme === 'dark'
          : newTheme === 'dark'
      );
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = {
    // Background colors
    background: isDark ? '#1a1a1a' : '#ffffff',
    surface: isDark ? '#2d2d2d' : '#f9fafb',
    surfaceHighlight: isDark ? '#3d3d3d' : '#f3f4f6',
    
    // Text colors
    text: isDark ? '#e5e7eb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    textTertiary: isDark ? '#6b7280' : '#9ca3af',
    
    // Border colors
    border: isDark ? '#404040' : '#e5e7eb',
    borderHighlight: isDark ? '#525252' : '#d1d5db',
    
    // Primary colors (consistent across themes)
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#60a5fa',
    
    // Status colors
    success: isDark ? '#22c55e' : '#16a34a',
    error: isDark ? '#ef4444' : '#dc2626',
    warning: isDark ? '#f59e0b' : '#d97706',
    info: isDark ? '#3b82f6' : '#2563eb',
    
    // Overlay colors
    overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    
    // Skeleton loading colors
    skeletonBase: isDark ? '#2d2d2d' : '#e5e7eb',
    skeletonHighlight: isDark ? '#3d3d3d' : '#f3f4f6',
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme: setThemePreference,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

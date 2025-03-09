import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default theme values (light theme)
const defaultTheme = {
  colors: {
    primary: '#3b82f6',
    background: '#fff',
    card: '#fff',
    text: '#111827',
    border: '#e5e7eb',
    textSecondary: '#6b7280',
  },
  isDark: false,
  theme: 'light',
  setTheme: () => {}, // Placeholder function
};

// Create the theme context with default values
const ThemeContext = createContext(defaultTheme);

/**
 * ThemeProvider Component:
 * Provides the theme context to the entire application.  It manages the current theme (light, dark, or system),
 * loads and saves the user's theme preference, and provides a function to update the theme.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 */
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Get the system's color scheme (light or dark)
  const [theme, setTheme] = useState('system'); // 'system', 'light', or 'dark'
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark'); // Boolean for dark mode

  // Load the saved theme preference on component mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update isDark when the system color scheme changes and the theme is set to 'system'
  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, theme]);

  // Function to load the saved theme preference from AsyncStorage
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

  // Function to save the theme preference to AsyncStorage
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

  // Define the color palette based on the current theme (light or dark)
  const colors = {
    // Background colors
    background: isDark ? '#1a1a1a' : '#ffffff', // Dark: Dark gray, Light: White
    surface: isDark ? '#2d2d2d' : '#f9fafb',   // Dark: Slightly lighter gray, Light: Off-white
    surfaceHighlight: isDark ? '#3d3d3d' : '#f3f4f6', // Dark: Even lighter gray, Light: Very light gray

    // Text colors
    text: isDark ? '#e5e7eb' : '#111827',       // Dark: Light gray, Light: Dark gray
    textSecondary: isDark ? '#9ca3af' : '#6b7280', // Dark: Medium gray, Light: Medium-dark gray
    textTertiary: isDark ? '#6b7280' : '#9ca3af', // Dark: Medium-dark gray, Light: Medium gray

    // Border colors
    border: isDark ? '#404040' : '#e5e7eb',       // Dark: Dark gray, Light: Light gray
    borderHighlight: isDark ? '#525252' : '#d1d5db', // Dark: Slightly lighter dark gray, Light: Light gray

    // Primary colors (consistent across themes)
    primary: '#3b82f6', // Blue
    primaryDark: '#2563eb', // Darker blue
    primaryLight: '#60a5fa', // Lighter blue

    // Status colors
    success: isDark ? '#22c55e' : '#16a34a', // Green
    error: isDark ? '#ef4444' : '#dc2626',   // Red
    warning: isDark ? '#f59e0b' : '#d97706', // Yellow/Orange
    info: isDark ? '#3b82f6' : '#2563eb',    // Blue

    // Overlay colors
    overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)', // Semi-transparent black

    // Skeleton loading colors
    skeletonBase: isDark ? '#2d2d2d' : '#e5e7eb', // Dark: Dark gray, Light: Light gray
    skeletonHighlight: isDark ? '#3d3d3d' : '#f3f4f6', // Dark: Slightly lighter gray, Light: Very light gray
  };

  return (
    <ThemeContext.Provider
      value={{
        theme, // The current theme ('system', 'light', or 'dark')
        isDark, // Boolean indicating if the dark theme is active
        setTheme: setThemePreference, // Function to set the theme
        colors, // The color palette based on the current theme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme context.
 * @returns {object} The theme context value.
 * @throws {Error} If used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

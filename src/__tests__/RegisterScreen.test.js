import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import api from '../axiosInstance';

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

// Mock ThemeContext
jest.mock('../context/ThemeContext', () => ({
  ThemeContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({
      colors: {
        primary: '#6200ee',
        background: '#ffffff',
        card: '#ffffff',
        text: '#000000',
        border: '#cccccc',
        notification: '#ff4081',
      },
      isDark: false,
    }),
  },
  useTheme: jest.fn().mockReturnValue({
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      card: '#ffffff',
      text: '#000000',
      border: '#cccccc',
      notification: '#ff4081',
    },
    isDark: false,
  }),
}));

// Mock the API
jest.mock('../axiosInstance');

// Mock the lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Mail: () => 'Mail-Icon',
  Lock: () => 'Lock-Icon',
  User: () => 'User-Icon',
  EyeOff: () => 'EyeOff-Icon',
  Eye: () => 'Eye-Icon',
  AlertCircle: () => 'AlertCircle-Icon',
}));

describe('RegisterScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <ThemeContext.Provider>
        <RegisterScreen />
      </ThemeContext.Provider>
    );
    
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('navigates to Login screen on "Already have an account?" press', () => {
    const { getByText } = render(
      <ThemeContext.Provider>
        <RegisterScreen />
      </ThemeContext.Provider>
    );
    
    fireEvent.press(getByText('Already have an account? Login'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});

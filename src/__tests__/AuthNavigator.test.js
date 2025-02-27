import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '../AuthNavigator';
import { AuthContext } from '../AuthContext';

// Mock the screens used in AuthNavigator
jest.mock('../LoginScreen', () => () => 'LoginScreen');
jest.mock('../RegisterScreen', () => () => 'RegisterScreen');
jest.mock('../TermsScreen', () => () => 'TermsScreen');
jest.mock('../ForgotPasswordScreen', () => () => 'ForgotPasswordScreen');
jest.mock('../LoadingScreen', () => () => 'LoadingScreen');

// Mock the AuthContext
jest.mock('../AuthContext', () => ({
  AuthContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({
      isLoading: false,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    }),
  },
  useContext: jest.fn().mockReturnValue({
    isLoading: false,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}));

describe('AuthNavigator', () => {
  it('renders correctly when not loading', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AuthContext.Provider value={{ isLoading: false }}>
          <AuthNavigator />
        </AuthContext.Provider>
      </NavigationContainer>
    );
    
    // Since we're mocking the screens to return their names as strings,
    // we can check if the initial screen (LoginScreen) is rendered
    expect(getByText('LoginScreen')).toBeTruthy();
  });

  it('renders LoadingScreen when loading', () => {
    // Override the mock for this specific test
    jest.spyOn(React, 'useContext').mockReturnValue({ isLoading: true });
    
    const { getByText } = render(
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
    
    expect(getByText('LoadingScreen')).toBeTruthy();
  });
});

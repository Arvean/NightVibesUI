import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { renderWithProviders } from './setup/testUtils';
import { createMockApiError, createMockApiResponse } from './setup/mockFactories';
import { defaultAuthState } from '../__mocks__/AuthContext';
import { MockProviders } from './setup/mockProviders';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Skip all tests in this file for now
describe.skip('LoginScreen', () => {
    const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigation.mockReturnValue(mockNavigation);
    });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

    it('handles successful login', async () => {
        const mockLoginResponse = createMockApiResponse({ access: 'mock-access-token', refresh: 'mock-refresh-token' });

        const wrapper = ({ children }) => (
            <MockProviders authState={{
                login: jest.fn().mockResolvedValue(mockLoginResponse),
            }}>
                {children}
            </MockProviders>
        );

        const { getByPlaceholderText, getByText, result } = await renderWithProviders(<LoginScreen />, { wrapper });

        fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.userToken).toBe('mock-access-token');
          expect(result.current.error).toBeNull();
        });
    });

    it('handles login error', async () => {
      const wrapper = ({ children }) => (
          <MockProviders authState={{
              login: jest.fn().mockRejectedValue(new Error('Login failed')),
          }}>
              {children}
          </MockProviders>
      );
        const { getByPlaceholderText, getByText, findByText, result } = await renderWithProviders(<LoginScreen />, { wrapper });

        fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.userToken).toBeNull();
          expect(result.current.userInfo).toBeNull();
          expect(result.current.error).toBe('Login failed');
        });
    });

    it('navigates to forgot password screen', () => {
        const { getByText } = renderWithProviders(<LoginScreen />);

        fireEvent.press(getByText('Forgot Password?'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('navigates to register screen', () => {
        const { getByText } = renderWithProviders(<LoginScreen />);
        
        // Find the "Register" button by its title and press it
        fireEvent.press(getByText((content, element) => {
            return element.props.title === 'Register';
        }));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
    });
});

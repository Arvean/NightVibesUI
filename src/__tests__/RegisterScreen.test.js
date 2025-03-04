import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';
import { useNavigation } from '@react-navigation/native';
import { renderWithProviders } from './setup/testUtils';
import { createMockApiError, createMockApiResponse } from './setup/mockFactories';
import { defaultAuthState } from '../__mocks__/AuthContext';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

describe('RegisterScreen', () => {
    const mockNavigation = {
        navigate: jest.fn(),
        setOptions: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigation.mockReturnValue(mockNavigation);
    });

    it('renders correctly', async () => {
        const { getByPlaceholderText, getByText } = await renderWithProviders(<RegisterScreen />);

        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByText('Register')).toBeTruthy();
    });

    it('navigates to Login screen on "Already have an account?" press', async () => {
        const { getByText } = await renderWithProviders(<RegisterScreen />);

        fireEvent.press(getByText('Already have an account? Login'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });

  it('submits registration form with correct data', async () => {
    const mockRegister = jest.fn().mockResolvedValue({});
    const wrapper = ({ children }) => (
      <MockProviders authState={{ register: mockRegister }}>
        {children}
      </MockProviders>
    );

    const { getByPlaceholderText, getByText, getByTestId } = await renderWithProviders(<RegisterScreen />, { wrapper });

    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    // Find and press the terms and conditions checkbox
    const termsCheckbox = getByTestId('terms-checkbox');
    fireEvent(termsCheckbox, 'onValueChange', true);

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

    it('displays error message when registration fails', async () => {
      const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed. Please try again.'));
      const wrapper = ({ children }) => (
        <MockProviders authState={{ register: mockRegister }}>
          {children}
        </MockProviders>
      );

        const { getByPlaceholderText, getByText, findByText, getByTestId } = await renderWithProviders(<RegisterScreen />, { wrapper });

        const usernameInput = getByPlaceholderText('Username');
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password123');

        const termsCheckbox = getByTestId('terms-checkbox');
        fireEvent(termsCheckbox, 'onValueChange', true);

        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(findByText('Registration failed. Please try again.')).toBeTruthy();
        });
    });

    it('displays error if passwords do not match', async () => {
        const { getByPlaceholderText, getByText, findByText } = await renderWithProviders(<RegisterScreen />);

        const usernameInput = getByPlaceholderText('Username');
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password456'); // Different password

        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(findByText('Passwords do not match.')).toBeTruthy();
        });
    });

    it('displays error if terms and conditions are not agreed to', async () => {
        const { getByPlaceholderText, getByText, findByText } = await renderWithProviders(<RegisterScreen />);

        const usernameInput = getByPlaceholderText('Username');
        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const confirmPasswordInput = getByPlaceholderText('Confirm Password');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.changeText(confirmPasswordInput, 'password123');

        fireEvent.press(getByText('Register'));

        await waitFor(() => {
            expect(findByText('You must agree to the terms and conditions.')).toBeTruthy();
        });
    });
});

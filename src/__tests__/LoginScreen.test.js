import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { AuthContext } from '../AuthContext';

const mockLogin = jest.fn();
const mockNavigation = { navigate: jest.fn() };

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithContext = (ui) => {
        return render(
            <AuthContext.Provider
                value={{
                    login: mockLogin,
                    isLoading: false,
                    error: null,
                }}
            >
                {ui}
            </AuthContext.Provider>
        );
    };

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = renderWithContext(<LoginScreen navigation={mockNavigation} />);
        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Sign In')).toBeTruthy();
        expect(getByText('Forgot Password?')).toBeTruthy();
    });

    it('calls login function with correct credentials', async () => {
        const { getByPlaceholderText, getByText } = renderWithContext(<LoginScreen navigation={mockNavigation} />);

        const usernameInput = getByPlaceholderText('Username');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Sign In');

        fireEvent.changeText(usernameInput, 'testuser');
        fireEvent.changeText(passwordInput, 'password');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
        });
    });

    it('navigates to ForgotPasswordScreen on "Forgot Password?" press', () => {
        const { getByText } = renderWithContext(<LoginScreen navigation={mockNavigation} />);

        const forgotPasswordLink = getByText('Forgot Password?');
        fireEvent.press(forgotPasswordLink);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
    });
});

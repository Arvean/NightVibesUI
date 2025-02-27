import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import api from '../axiosInstance';

jest.mock('../axiosInstance');

describe('ForgotPasswordScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
    });

    it('sends reset password email on button press', async () => {
        const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
        const emailInput = getByPlaceholderText('Email');
        const resetButton = getByText('Reset Password');

        api.post.mockResolvedValue({ status: 200 });

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(resetButton);

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/forgot-password/', { email: 'test@example.com' }));
        await waitFor(() => expect(getByText('Password reset email sent! Please check your inbox.')).toBeTruthy());
    });

    it('displays error message on API failure', async () => {
        const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
        const emailInput = getByPlaceholderText('Email');
        const resetButton = getByText('Reset Password');

        const errorMessage = 'Failed to send reset password email.';
        api.post.mockRejectedValue(new Error(errorMessage));

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(resetButton);

        await waitFor(() => expect(getByText(errorMessage)).toBeTruthy());
    });
});

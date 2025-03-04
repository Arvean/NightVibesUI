import React from 'react';
import { fireEvent, waitFor, render, act } from '@testing-library/react-native';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import { createMockApiError, createMockApiResponse } from './setup/mockFactories';
import axiosInstance from '../axiosInstance';
import { renderWithProviders } from './setup/testUtils';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('ForgotPasswordScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.skip('renders correctly', async () => {
        let component;
        await act(async () => {
            component = renderWithProviders(<ForgotPasswordScreen />);
        });

        const { getByPlaceholderText, getByText } = component;
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
    });

    it.skip('sends reset password email on button press', async () => {
        axiosInstance.post.mockImplementation((url) => {
            if (url === '/api/forgot-password/') {
                return Promise.resolve(createMockApiResponse({}));
            }
            return Promise.reject(createMockApiError('Unexpected URL'));
        });
        
        let component;
        await act(async () => {
            component = renderWithProviders(<ForgotPasswordScreen />);
        });

        const { getByPlaceholderText, getByText } = component;
        const emailInput = getByPlaceholderText('Email');
        const resetButton = getByText('Reset Password');

        await act(async () => {
            fireEvent.changeText(emailInput, 'test@example.com');
        });
        
        await act(async () => {
            fireEvent.press(resetButton);
        });
        
        expect(axiosInstance.post).toHaveBeenCalledWith('/api/forgot-password/', { email: 'test@example.com' });
    });

    it.skip('displays error message on API failure', async () => {
        const errorMessage = 'Failed to send reset password email. Please try again.';
        // Mock the API response using the global mock
        axiosInstance.post.mockImplementation((url) => {
            if (url === '/api/forgot-password/') {
                return Promise.reject(createMockApiError(errorMessage));
            }
            return Promise.resolve(createMockApiResponse({}));
        });

        let component;
        await act(async () => {
            component = renderWithProviders(<ForgotPasswordScreen />);
        });

        const { getByPlaceholderText, getByText, findByText } = component;
        const emailInput = getByPlaceholderText('Email');
        const resetButton = getByText('Reset Password');

        await act(async () => {
            fireEvent.changeText(emailInput, 'test@example.com');
        });
        
        await act(async () => {
            fireEvent.press(resetButton);
        });

        const errorElement = await findByText(errorMessage);
        expect(errorElement).toBeTruthy();
    });
});

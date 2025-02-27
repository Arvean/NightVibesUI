import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckInScreen from '../CheckInScreen';
import { ThemeProvider } from '../context/ThemeContext';
import api from '../axiosInstance';

// Mock axios instance
jest.mock('../axiosInstance', () => {
  return {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: { success: true } })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  };
});

// Import the mocked axiosInstance
import axiosInstance from '../axiosInstance';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
}));

describe('CheckInScreen', () => {
    const mockRoute = {
        params: {
            venueId: '123',
            venueName: 'Test Venue',
        },
    };
    const mockNavigation = {
        goBack: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useRoute.mockReturnValue(mockRoute);
        useNavigation.mockReturnValue(mockNavigation);
    });

    it('renders correctly', async () => {
        axiosInstance.post.mockResolvedValue({ data: {} });
        const { getByText, getByPlaceholderText } = render(<CheckInScreen />);

        expect(getByText('Check In')).toBeTruthy();
        expect(getByText('Test Venue')).toBeTruthy();
        expect(getByPlaceholderText('Enter your review (optional)')).toBeTruthy();
        expect(getByText('Check In')).toBeTruthy();
    });

    it('submits check-in with review', async () => {
        axiosInstance.post.mockResolvedValue({ data: {} });
        const { getByText, getByPlaceholderText } = render(<CheckInScreen />);

        const reviewInput = getByPlaceholderText('Enter your review (optional)');
        fireEvent.changeText(reviewInput, 'Great place!');

        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);

        await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledWith(`/venues/123/checkins/`, { review: 'Great place!' }));
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('submits check-in without review', async () => {
        axiosInstance.post.mockResolvedValue({ data: {} });
        const { getByText } = render(<CheckInScreen />);

        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);

        await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledWith(`/venues/123/checkins/`, { review: '' }));
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('handles check-in error', async () => {
        axiosInstance.post.mockRejectedValue(new Error('Check-in failed'));
        const { getByText, getByPlaceholderText } = render(<CheckInScreen />);

        const reviewInput = getByPlaceholderText('Enter your review (optional)');
        fireEvent.changeText(reviewInput, 'Great place!');

        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);

        await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledWith(`/venues/123/checkins/`, { review: 'Great place!' }));
        expect(mockNavigation.goBack).not.toHaveBeenCalled(); // Should not navigate back on error
    });
});

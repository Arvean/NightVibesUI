import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import VenueDetailScreen from '../VenueDetailScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../axiosInstance';
import mockGeolocation from '../__mocks__/mockGeolocation';

jest.mock('../axiosInstance', () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn()
}));

jest.mock('../context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

const mockVenue = {
    id: '1',
    name: 'Test Venue',
    address: '123 Main St',
    description: 'A great place to hang out',
    category: 'bar',
    opening_hours: '9am - 5pm'
};

const mockVibe = {
    vibe: 'Lively',
    checkins_count: 15
};

const mockCheckins = [];
const mockRatings = { average_rating: 4.2, total_ratings: 20, rating_distribution: { 5: 10, 4: 5, 3: 3, 2: 1, 1: 1 }, recent_reviews: [] };
const mockUserRating = { id: 'user-rating-1', rating: 4, comment: 'Good vibe!' };

const mockTheme = {
    colors: {
        primary: '#3b82f6',
        background: '#fff',
        card: '#fff',
        text: '#111827',
        border: '#e5e7eb',
        textSecondary: '#6b7280',
        foreground: '#111827',
        mutedForeground: '#6b7280',
        iconBackground: '#f3f4f6',
        destructive: 'red'
    },
    isDark: false,
};

describe('VenueDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Mock successful geolocation
        mockGeolocation.getCurrentPosition.mockImplementation((success) => {
            success({ coords: { latitude: 40.7128, longitude: -74.0060 } });
        });

        // Mock API responses - improve implementation to handle all endpoints
        axiosInstance.get.mockImplementation((url) => {
            if (url.includes(`/api/venues/${mockVenue.id}/`)) {
                if (url.includes('current-vibe')) {
                    return Promise.resolve({ data: mockVibe });
                } else if (url.includes('checkins')) {
                    return Promise.resolve({ data: mockCheckins });
                } else if (url.includes('ratings')) {
                    return Promise.resolve({ data: mockRatings });
                } else {
                    return Promise.resolve({ data: mockVenue });
                }
            } 
            else if (url.includes('/api/ratings/') && url.includes('user=current')) {
                return Promise.resolve({ data: { results: [] } }); // Initially no user rating
            }
            return Promise.reject(new Error(`Unexpected URL: ${url}`));
        });

        // Mock POST for rating submission
        axiosInstance.post.mockImplementation((url) => {
            if (url.includes('/api/ratings/')) {
                return Promise.resolve({ data: { id: 'new-rating-id', success: true } });
            }
            return Promise.reject(new Error(`Unexpected POST URL: ${url}`));
        });

        // Mock PUT for rating updates
        axiosInstance.put.mockImplementation((url) => {
            if (url.includes(`/api/ratings/${mockUserRating.id}/`)) {
                return Promise.resolve({ data: { success: true } });
            }
            return Promise.reject(new Error(`Unexpected PUT URL: ${url}`));
        });

        // Mock DELETE for rating deletion
        axiosInstance.delete.mockImplementation((url) => {
            if (url.includes(`/api/ratings/${mockUserRating.id}/`)) {
                return Promise.resolve({ data: { success: true } });
            }
            return Promise.reject(new Error(`Unexpected DELETE URL: ${url}`));
        });

        // Set up navigation and theme mocks
        useNavigation.mockReturnValue({
            navigate: jest.fn(),
            goBack: jest.fn()
        });
        useRoute.mockReturnValue({
            params: { venueId: '1' },
        });
        useTheme.mockReturnValue(mockTheme);
    });

    it('renders loading state', async () => {
        let component;
        
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByTestId } = component;
        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('renders error state', async () => {
        // Mock failure for all API calls
        axiosInstance.get.mockImplementation(() => 
            Promise.reject(new Error('Failed to load venue details'))
        );
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByText } = component;
        
        await waitFor(() => {
            expect(getByText('Failed to load venue details. Please try again.')).toBeTruthy();
        }, { timeout: 3000 });
    });

    it('renders venue details', async () => {
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByText, queryByTestId } = component;
        
        // Wait for the loading indicator to disappear
        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeNull();
        }, { timeout: 3000 });
        
        // Then check for venue details
        await waitFor(() => {
            expect(getByText('Test Venue')).toBeTruthy();
            expect(getByText('123 Main St')).toBeTruthy();
            expect(getByText('Lively')).toBeTruthy(); // Current Vibe
            expect(getByText('15 checked in')).toBeTruthy();
            expect(getByText('4.2')).toBeTruthy(); // Average Rating
        }, { timeout: 3000 });
    });

    it('navigates back on back button press', async () => {
        const navigation = useNavigation();
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByTestId } = component;
        
        await waitFor(() => {
            expect(getByTestId('back-button')).toBeTruthy();
        });
        
        const backButton = getByTestId('back-button');
        fireEvent.press(backButton);
        
        expect(navigation.goBack).toHaveBeenCalled();
    });

    it('navigates to CheckIn screen on check-in button press', async () => {
        const navigation = useNavigation();
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByText } = component;
        
        await waitFor(() => {
            expect(getByText('Check In')).toBeTruthy();
        }, { timeout: 3000 });
        
        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);
        
        expect(navigation.navigate).toHaveBeenCalledWith('CheckIn', { venueId: '1' });
    });

    it('navigates to Map screen on view on map button press', async () => {
        const navigation = useNavigation();
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByText } = component;
        
        await waitFor(() => {
            expect(getByText('View on Map')).toBeTruthy();
        }, { timeout: 3000 });
        
        const viewOnMapButton = getByText('View on Map');
        fireEvent.press(viewOnMapButton);
        
        expect(navigation.navigate).toHaveBeenCalledWith('Map', { venueId: '1' });
    });

    it('handles rating submission', async () => {
        // More specific mock for user rating API call
        axiosInstance.get.mockImplementation((url) => {
            if (url.includes(`/api/venues/${mockVenue.id}/`)) {
                if (url.includes('current-vibe')) {
                    return Promise.resolve({ data: mockVibe });
                } else if (url.includes('checkins')) {
                    return Promise.resolve({ data: mockCheckins });
                } else if (url.includes('ratings')) {
                    return Promise.resolve({ data: mockRatings });
                } else {
                    return Promise.resolve({ data: mockVenue });
                }
            } 
            else if (url.includes('/api/ratings/') && url.includes('user=current')) {
                // First call returns no rating, after POST returns the new rating
                return Promise.resolve({ data: { results: [] } });
            }
            return Promise.reject(new Error(`Unexpected URL: ${url}`));
        });
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByTestId, queryByTestId } = component;
        
        // Wait for loading to finish
        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeNull();
        }, { timeout: 3000 });
        
        // Wait for the rate button to be available
        await waitFor(() => {
            expect(getByTestId('rate-venue-button')).toBeTruthy();
        }, { timeout: 3000 });
        
        // Click the rate button
        await act(async () => {
            fireEvent.press(getByTestId('rate-venue-button'));
        });
        
        // After clicking the rate button, the dialog should appear with a submit button
        await waitFor(() => {
            expect(getByTestId('submit-rating-button')).toBeTruthy();
        }, { timeout: 3000 });
        
        // Click the submit button
        await act(async () => {
            fireEvent.press(getByTestId('submit-rating-button'));
        });
        
        // Verify that post was called with correct data
        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith('/api/ratings/', expect.objectContaining({
                venue: '1',
                rating: expect.any(Number),
                comment: expect.any(String)
            }));
        }, { timeout: 3000 });
    });

    it('handles rating update', async () => {
        // Mock user having an existing rating
        axiosInstance.get.mockImplementation((url) => {
            if (url.includes(`/api/venues/${mockVenue.id}/`)) {
                if (url.includes('current-vibe')) {
                    return Promise.resolve({ data: mockVibe });
                } else if (url.includes('checkins')) {
                    return Promise.resolve({ data: mockCheckins });
                } else if (url.includes('ratings')) {
                    return Promise.resolve({ data: mockRatings });
                } else {
                    return Promise.resolve({ data: mockVenue });
                }
            } 
            else if (url.includes('/api/ratings/') && url.includes('user=current')) {
                return Promise.resolve({ data: { results: [mockUserRating] } });
            }
            return Promise.reject(new Error(`Unexpected URL: ${url}`));
        });
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByTestId, queryByTestId } = component;
        
        // Wait for loading to finish
        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeNull();
        }, { timeout: 3000 });
        
        // Wait for the edit button to be available
        await waitFor(() => {
            expect(getByTestId('edit-rating-button')).toBeTruthy();
        }, { timeout: 3000 });
        
        // Click the edit button
        await act(async () => {
            fireEvent.press(getByTestId('edit-rating-button'));
        });
        
        // After clicking the edit button, the dialog should appear with a submit button
        await waitFor(() => {
            expect(getByTestId('submit-rating-button')).toBeTruthy();
        }, { timeout: 3000 });
        
        // Click the submit button
        await act(async () => {
            fireEvent.press(getByTestId('submit-rating-button'));
        });
        
        // Verify that put was called with correct data
        await waitFor(() => {
            expect(axiosInstance.put).toHaveBeenCalledWith(`/api/ratings/${mockUserRating.id}/`, expect.objectContaining({
                venue: '1'
            }));
        }, { timeout: 3000 });
    });

    it('handles rating deletion', async () => {
        // Mock user having an existing rating
        axiosInstance.get.mockImplementation((url) => {
            if (url.includes(`/api/venues/${mockVenue.id}/`)) {
                if (url.includes('current-vibe')) {
                    return Promise.resolve({ data: mockVibe });
                } else if (url.includes('checkins')) {
                    return Promise.resolve({ data: mockCheckins });
                } else if (url.includes('ratings')) {
                    return Promise.resolve({ data: mockRatings });
                } else {
                    return Promise.resolve({ data: mockVenue });
                }
            } 
            else if (url.includes('/api/ratings/') && url.includes('user=current')) {
                return Promise.resolve({ data: { results: [mockUserRating] } });
            }
            return Promise.reject(new Error(`Unexpected URL: ${url}`));
        });
        
        let component;
        await act(async () => {
            component = render(<VenueDetailScreen />);
        });
        
        const { getByTestId, queryByTestId } = component;
        
        // Wait for loading to finish
        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeNull();
        }, { timeout: 3000 });
        
        // Wait for the delete button to be available
        await waitFor(() => {
            expect(getByTestId('delete-rating-button')).toBeTruthy();
        }, { timeout: 3000 });
        
        // Click the delete button
        await act(async () => {
            fireEvent.press(getByTestId('delete-rating-button'));
        });
        
        // Verify that delete was called correctly
        await waitFor(() => {
            expect(axiosInstance.delete).toHaveBeenCalledWith(`/api/ratings/${mockUserRating.id}/`);
        }, { timeout: 3000 });
    });
});

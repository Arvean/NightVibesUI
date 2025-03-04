import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import VenueDetailScreen from '../VenueDetailScreen';
import { renderWithProviders, waitForPromises } from './setup/testUtils';
import { createMockApiError, createMockApiResponse, createMockVenue, createMockCheckin, createMockRating } from './setup/mockFactories';
import api from '../axiosInstance';

// Mock axios
jest.mock('../axiosInstance', () => ({
  get: jest.fn()
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      venueId: '1'
    }
  })
}));

describe('VenueDetailScreen', () => {
  const mockVenue = createMockVenue({
    id: '1',
    name: 'Test Venue',
    address: '123 Main St',
    description: 'A great place to hang out',
    category: 'bar',
    opening_hours: '9am - 5pm',
    latitude: 40.7128,
    longitude: -74.0060,
    image_url: 'https://example.com/venue1.jpg',
    features: ['music', 'food', 'dancing'],
    phone: '555-123-4567',
    website: 'https://example.com',
    current_capacity: 75,
    capacity_limit: 150,
    average_rating: 4.2,
  });

  const mockRatings = [createMockRating(), createMockRating()];
  const mockCheckins = [createMockCheckin(), createMockCheckin()];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default api mocks
    api.get.mockImplementation((url) => {
      if (url.includes('/api/venues/1/ratings/')) {
        return Promise.resolve({ status: 200, data: mockRatings });
      } else if (url.includes('/api/venues/1/checkins/')) {
        return Promise.resolve({ status: 200, data: mockCheckins });
      } else if (url.includes('/api/venues/1/current-vibe/')) {
        return Promise.resolve({ status: 200, data: { vibe: 'Lively' } });
      } else if (url.includes('/api/venues/1/')) {
        return Promise.resolve({ status: 200, data: mockVenue });
      } else if (url.includes('/api/ratings/?venue=1&user=current')) {
        return Promise.resolve({ status: 200, data: [] }); // No user rating initially
      } else {
        return Promise.reject(new Error('Unexpected URL'));
      }
    });
  });

  it.skip('renders venue details correctly', async () => {
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
      await waitForPromises();
    });

    const { findByText } = component;
    expect(await findByText('Test Venue')).toBeTruthy();
    expect(await findByText('123 Main St')).toBeTruthy();
    expect(await findByText('A great place to hang out')).toBeTruthy();
    expect(await findByText('9am - 5pm')).toBeTruthy();
  });

  it.skip('shows loading state initially', async () => {
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
    });

    const { getByTestId } = component;
    expect(getByTestId('loading-indicator')).toBeDefined();
  });

  it.skip('handles check-in button press', async () => {
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
      await waitForPromises();
    });

    const { getByText } = component;
    const checkInButton = getByText('Check In');
    
    await act(async () => {
      fireEvent.press(checkInButton);
    });

    const { useNavigation } = require('@react-navigation/native');
    expect(useNavigation().navigate).toHaveBeenCalledWith('CheckIn', { venueId: '1' });
  });

  it.skip('handles add rating button press', async () => {
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
      await waitForPromises();
    });

    const { getByText, queryByText } = component;
    const rateButton = getByText('Rate Venue');
    
    await act(async () => {
      fireEvent.press(rateButton);
    });

    expect(queryByText('Rate Test Venue')).not.toBeNull();
  });

  it.skip('handles data loading error', async () => {
    // Override the default mock to simulate an error
    api.get.mockImplementation((url) => {
      if (url.includes('/api/venues/1/')) {
        return Promise.reject(new Error('Failed to load venue details.'));
      }
      return Promise.resolve({ status: 200, data: {} });
    });
    
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
      await waitForPromises();
    });

    const { findByText } = component;
    expect(await findByText('Failed to load venue details. Please try again.')).toBeTruthy();
  });

  it.skip('navigates back when back button is pressed', async () => {
    let component;
    
    await act(async () => {
      component = renderWithProviders(<VenueDetailScreen />);
      await waitForPromises();
    });

    const { getByTestId } = component;
    const backButton = getByTestId('back-button');
    
    await act(async () => {
      fireEvent.press(backButton);
    });

    const { useNavigation } = require('@react-navigation/native');
    expect(useNavigation().goBack).toHaveBeenCalled();
  });
});

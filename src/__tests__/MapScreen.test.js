import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import MapScreen from '../MapScreen';
import { renderWithProviders } from './setup/testUtils';
import { createMockApiError, createMockApiResponse, createMockVenue } from './setup/mockFactories';
import { defaultAuthState } from '../__mocks__/AuthContext';
import useMapData from '../src/hooks/useMapData';

jest.mock('@react-navigation/native');
jest.mock('../src/hooks/useMapData');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
};

describe('MapScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigation.mockReturnValue(mockNavigation);
    });

  it('renders correctly', async () => {
      useMapData.mockReturnValue({
          isLoading: false,
          venues: [],
          friends: [],
          error: null,
          viewport: { latitude: 37.7749, longitude: -122.4194, zoom: 13 },
          selectedItem: null,
          setViewport: jest.fn(),
          setSelectedItem: jest.fn(),
          searchQuery: '',
          setSearchQuery: jest.fn(),
          sortBy: 'distance',
          setSortBy: jest.fn(),
          refreshData: jest.fn()
      });
      const { findByTestId } = await renderWithProviders(<MapScreen />);

      expect(await findByTestId('map-container')).toBeTruthy();
  });

    it('loads venues and friends on mount', async () => {
        const mockVenues = [createMockVenue()];
        const mockFriends = []; // You can add mock friends if needed

        useMapData.mockReturnValue({
            isLoading: false,
            venues: mockVenues,
            friends: mockFriends,
            error: null,
            viewport: { latitude: 37.7749, longitude: -122.4194, zoom: 13 },
            selectedItem: null,
            setViewport: jest.fn(),
            setSelectedItem: jest.fn(),
            searchQuery: '',
            setSearchQuery: jest.fn(),
            sortBy: 'distance',
            setSortBy: jest.fn(),
            refreshData: jest.fn()
        });

        await renderWithProviders(<MapScreen />);

        expect(useMapData).toHaveBeenCalled();
    });

    it('navigates to venue details when venue marker is pressed', async () => {
      const mockVenue = createMockVenue({ id: 'test-venue-id' });
      useMapData.mockReturnValue({
          isLoading: false,
          venues: [mockVenue],
          friends: [],
          error: null,
          viewport: { latitude: 37.7749, longitude: -122.4194, zoom: 13 },
          selectedItem: null,
          setViewport: jest.fn(),
          setSelectedItem: jest.fn(),
          searchQuery: '',
          setSearchQuery: jest.fn(),
          sortBy: 'distance',
          setSortBy: jest.fn(),
          refreshData: jest.fn()
      });

      const { findByTestId } = await renderWithProviders(<MapScreen />);

      const marker = await waitFor(() => getByTestId('venue-marker-test-venue-id'));
      fireEvent.press(marker);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('VenueDetail', { venueId: 'test-venue-id' });
  });


    it('handles venue loading error', async () => {
      useMapData.mockReturnValue({
          isLoading: false,
          venues: [],
          friends: [],
          error: 'Failed to load data. Please check your connection and try again.',
          viewport: { latitude: 37.7749, longitude: -122.4194, zoom: 13 },
          selectedItem: null,
          setViewport: jest.fn(),
          setSelectedItem: jest.fn(),
          searchQuery: '',
          setSearchQuery: jest.fn(),
          sortBy: 'distance',
          setSortBy: jest.fn(),
          refreshData: jest.fn()
      });

      const { findByText } = await renderWithProviders(<MapScreen />);

      expect(await findByText("Failed to load data. Please check your connection and try again.")).toBeTruthy();
    });
});

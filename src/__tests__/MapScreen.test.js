import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapScreen from '../MapScreen';
import { fetchVenues, fetchFriends } from '../__mocks__/api';

// Mock the API calls
jest.mock('../__mocks__/api');

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

// Mock venue and friend data
const mockVenueData = [
  {
    id: '1',
    name: 'Test Venue',
    category: 'Bar',
    current_vibe: 'Busy',
    location: {
      coordinates: [-74.006, 40.7128]
    }
  }
];

const mockFriendData = {
  nearby_friends: [
    {
      id: '1',
      username: 'testUser',
      last_seen: '5 minutes ago',
      location: {
        coordinates: [-74.006, 40.7128]
      }
    }
  ]
};

describe('MapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.006
        }
      })
    );

    // Mock successful API responses
    fetchVenues.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockVenueData)
    });

    fetchFriends.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFriendData)
    });
  });

  it('shows loading state initially', () => {
    render(<MapScreen />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when geolocation fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) =>
      error(new Error('Geolocation error'))
    );

    render(<MapScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/unable to get your location/i)).toBeInTheDocument();
    });
  });

  it('shows error message when API calls fail', async () => {
    fetchVenues.mockResolvedValue({ ok: false });
    fetchFriends.mockResolvedValue({ ok: false });

    render(<MapScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load map data/i)).toBeInTheDocument();
    });
  });

  it('renders map and markers after successful data fetch', async () => {
    render(<MapScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
      expect(screen.getByTestId('venue-marker-1')).toBeInTheDocument();
      expect(screen.getByTestId('friend-marker-1')).toBeInTheDocument();
    });
  });

  it('renders search input and allows typing', async () => {
    render(<MapScreen />);

    await waitFor(() => {
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput.value).toBe('test search');
    });
  });

  it('displays venue information when a venue marker is clicked', async () => {
    render(<MapScreen />);

    await waitFor(() => {
      const venueMarker = screen.getByTestId('venue-marker-1');
      fireEvent.click(venueMarker);

      expect(screen.getByText('Test Venue')).toBeInTheDocument();
      expect(screen.getByText('Bar')).toBeInTheDocument();
      expect(screen.getByText('Busy')).toBeInTheDocument();
    });
  });

  it('displays friend information when a friend marker is clicked', async () => {
    render(<MapScreen />);

    await waitFor(() => {
      const friendMarker = screen.getByTestId('friend-marker-1');
      fireEvent.click(friendMarker);

      expect(screen.getByText('testUser')).toBeInTheDocument();
      expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    });
  });
});

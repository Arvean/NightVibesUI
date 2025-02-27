import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapScreen from '../MapScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import api from '../axiosInstance';

// Mock react-map-gl
jest.mock('react-map-gl', () => {
  const React = require('react');
  
  const Map = ({ children, ...props }) => {
    return <div data-testid="map-container" {...props}>{children}</div>;
  };
  
  const Marker = ({ children, ...props }) => {
    return <div {...props}>{children}</div>;
  };
  
  const Popup = ({ children, ...props }) => {
    return <div {...props}>{children}</div>;
  };
  
  const NavigationControl = (props) => <div {...props} />;
  const GeolocateControl = (props) => <div {...props} />;
  
  return {
    __esModule: true,
    default: Map,
    Marker,
    Popup,
    NavigationControl,
    GeolocateControl
  };
});

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

// Mock the API
jest.mock('../axiosInstance');

// Mock the AuthContext
jest.mock('../AuthContext', () => ({
  AuthContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({
      user: { id: '1', username: 'testuser' },
      isAuthenticated: true,
    }),
  },
  useContext: jest.fn().mockReturnValue({
    user: { id: '1', username: 'testuser' },
    isAuthenticated: true,
  }),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('granted'),
  request: jest.fn().mockResolvedValue('granted'),
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'locationWhenInUse',
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'accessFineLocation',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    LIMITED: 'limited',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
  },
}));

// Mock @react-native-community/geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((success) => {
    success({
      coords: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
    });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}));

// Mock geolib
jest.mock('geolib', () => ({
  getDistance: jest.fn().mockReturnValue(1000),
}));

describe('MapScreen', () => {
  const mockVenues = [
    { 
      id: '1', 
      name: 'Venue 1', 
      location: { 
        coordinates: [-122.4324, 37.78825] 
      },
      category: 'Bar',
      current_vibe: 'Lively'
    },
    { 
      id: '2', 
      name: 'Venue 2', 
      location: { 
        coordinates: [-122.4324, 37.78825] 
      },
      category: 'Club',
      current_vibe: 'Crowded'
    },
  ];

  const mockFriends = [
    { 
      id: '1', 
      username: 'Friend 1', 
      location: { 
        coordinates: [-122.4324, 37.78825] 
      } 
    },
    { 
      id: '2', 
      username: 'Friend 2', 
      location: { 
        coordinates: [-122.4324, 37.78825] 
      } 
    },
  ];

  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    useRoute.mockReturnValue({ params: {} });
    
    // Mock API responses
    api.get.mockImplementation((url) => {
      if (url.includes('/api/venues/')) {
        return Promise.resolve({ data: mockVenues });
      } else if (url.includes('/api/friends/')) {
        return Promise.resolve({ data: mockFriends });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders the map screen', async () => {
    const { getByText, getByTestId } = render(
      <ThemeContext.Consumer>
        {(theme) => <MapScreen />}
      </ThemeContext.Consumer>
    );
    
    // Wait for the component to load
    await waitFor(() => {
      expect(getByText('Explore')).toBeTruthy();
    });
  });

  it('allows searching for venues', async () => {
    const { getByPlaceholderText } = render(
      <ThemeContext.Consumer>
        {(theme) => <MapScreen />}
      </ThemeContext.Consumer>
    );
    
    await waitFor(() => {
      const searchInput = getByPlaceholderText('Search venues...');
      expect(searchInput).toBeTruthy();
      fireEvent.changeText(searchInput, 'Venue 1');
    });
  });
});

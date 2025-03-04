import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

const createNavigationContext = () => {
  const navigationContext = React.createContext({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    isFocused: jest.fn(() => true),
    getState: jest.fn(() => ({})),
    getParent: jest.fn(() => null),
    setParams: jest.fn(),
  });

  const routeContext = React.createContext({
    key: 'test',
    name: 'Test',
    params: {},
  });

  return {
    NavigationContext: navigationContext,
    NavigationRouteContext: routeContext,
  };
};

const { NavigationContext, NavigationRouteContext } = createNavigationContext();

export const renderWithProviders = (ui, { theme = 'light', authState = {}, navigationValue = {}, routeValue = {} } = {}) => {
  const Wrapper = ({ children }) => (
    <NavigationContext.Provider value={{ ...NavigationContext._currentValue, ...navigationValue }}>
      <NavigationRouteContext.Provider value={{ ...NavigationRouteContext._currentValue, ...routeValue }}>
        <ThemeProvider initialTheme={theme}>
          <AuthProvider initialState={authState}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </NavigationRouteContext.Provider>
    </NavigationContext.Provider>
  );

  return render(ui, { wrapper: Wrapper });
};

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

export const createMockVenues = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `venue-${index + 1}`,
    name: `Venue ${index + 1}`,
    description: `Description for venue ${index + 1}`,
    address: `${index + 1} Test Street`,
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
    average_rating: Math.floor(Math.random() * 5) + 1,
    total_ratings: Math.floor(Math.random() * 100),
    distance: Math.floor(Math.random() * 5000),
    is_favorite: Math.random() > 0.5,
    photos: [`photo-${index + 1}`],
    opening_hours: '9:00 AM - 10:00 PM',
    contact_number: '+1234567890',
    website: 'https://example.com',
    capacity: Math.floor(Math.random() * 200) + 50,
    current_occupancy: Math.floor(Math.random() * 100),
  }));
};

export const createMockProfiles = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `user-${index + 1}`,
    username: `user${index + 1}`,
    email: `user${index + 1}@example.com`,
    profile_image: `https://example.com/profile${index + 1}.jpg`,
    bio: `Bio for user ${index + 1}`,
    location: `City ${index + 1}`,
    friends_count: Math.floor(Math.random() * 100),
    is_friend: Math.random() > 0.5,
    has_pending_request: Math.random() > 0.5,
  }));
};

/**
 * Creates mock check-in data
 * @param {number} count - Number of check-ins to create
 * @returns {Array} - Array of mock check-in objects
 */
export const createMockCheckins = (count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `checkin-${i}`,
    user: {
      id: `user-${i % 3}`,
      username: `testuser${i % 3}`,
      profile_image: i % 2 === 0 ? `https://example.com/profile-${i}.jpg` : null,
    },
    venue: {
      id: `venue-${i % 5}`,
      name: `Test Venue ${i % 5}`,
    },
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    comment: i % 2 === 0 ? `Great place to hang out! #${i}` : null,
  }));
};

/**
 * Creates mock ratings data
 * @param {number} count - Number of ratings to create
 * @returns {Array} - Array of mock rating objects
 */
export const createMockRatings = (count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rating-${i}`,
    user: {
      id: `user-${i % 3}`,
      username: `testuser${i % 3}`,
      profile_image: i % 2 === 0 ? `https://example.com/profile-${i}.jpg` : null,
    },
    venue: {
      id: `venue-${i % 5}`,
      name: `Test Venue ${i % 5}`,
    },
    rating: 3 + (i % 3),
    comment: i % 2 === 0 ? `Rating comment #${i}` : null,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
  }));
};

export default {
  renderWithProviders,
  flushPromises,
  createMockVenues,
  createMockProfiles,
  createMockCheckins,
  createMockRatings,
}; 
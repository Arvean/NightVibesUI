import React from 'react';
import { renderWithProviders } from './setup/testUtils';
import MainNavigator from '../MainNavigator';
import { defaultAuthState } from '../__mocks__/AuthContext';

// Mock all screens used in MainNavigator
jest.mock('../HomeScreen', () => 'HomeScreen');
jest.mock('../MapScreen', () => 'MapScreen');
jest.mock('../VenueListScreen', () => 'VenueListScreen');
jest.mock('../FriendActivityScreen', () => 'FriendActivityScreen');
jest.mock('../ProfileScreen', () => 'ProfileScreen');
jest.mock('../EditProfileScreen', () => 'EditProfileScreen');
jest.mock('../FriendListScreen', () => 'FriendListScreen');
jest.mock('../FriendRequestsScreen', () => 'FriendRequestsScreen');
jest.mock('../FriendDiscoveryScreen', () => 'FriendDiscoveryScreen');
jest.mock('../MeetupListScreen', () => 'MeetupListScreen');
jest.mock('../NotificationScreen', () => 'NotificationScreen');
jest.mock('../NotificationPreferencesScreen', () => 'NotificationPreferencesScreen');
jest.mock('../CheckInScreen', () => 'CheckInScreen');
jest.mock('../VenueDetailScreen', () => 'VenueDetailScreen');

// Mock navigation components
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ name, component }) => <div data-testid={`tab-${name}`}>{name}</div>,
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ name, component }) => <div data-testid={`screen-${name}`}>{name}</div>,
  }),
}));

describe('MainNavigator', () => {
  it('renders without crashing', async () => {
    await renderWithProviders(<MainNavigator />, {
      authState: defaultAuthState,
    });
  });

  it('renders main tab navigator when authenticated', async () => {
    const { getByTestId } = await renderWithProviders(<MainNavigator />, {
      authState: { ...defaultAuthState, userToken: 'mock-token' },
    });

    // Main tabs should be rendered
    expect(getByTestId('tab-Home')).toBeTruthy();
    expect(getByTestId('tab-Map')).toBeTruthy();
    expect(getByTestId('tab-Venues')).toBeTruthy();
    expect(getByTestId('tab-Social')).toBeTruthy();
    expect(getByTestId('tab-Notifications')).toBeTruthy();
    expect(getByTestId('tab-Profile')).toBeTruthy();
  });
});

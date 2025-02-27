import React from 'react';
import { render } from '@testing-library/react-native';
import MainNavigator from '../MainNavigator';
import { AuthProvider } from '../AuthContext';

jest.mock('react-native'); // Explicitly mock react-native
jest.mock('@/HomeScreen', () => 'HomeScreen');
jest.mock('@/MapScreen', () => 'MapScreen');
jest.mock('@/VenueListScreen', () => 'VenueListScreen');
jest.mock('@/FriendActivityScreen', () => 'FriendActivityScreen');
jest.mock('@/ProfileScreen', () => 'ProfileScreen');
jest.mock('@/EditProfileScreen', () => 'EditProfileScreen');
jest.mock('@/FriendListScreen', () => 'FriendListScreen');
jest.mock('@/FriendRequestsScreen', () => 'FriendRequestsScreen');
jest.mock('@/FriendDiscoveryScreen', () => 'FriendDiscoveryScreen');
jest.mock('@/MeetupListScreen', () => 'MeetupListScreen');
jest.mock('@/NotificationScreen', () => 'NotificationScreen');
jest.mock('@/NotificationPreferencesScreen', () => 'NotificationPreferencesScreen');
jest.mock('@/CheckInScreen', () => 'CheckInScreen');
jest.mock('@/VenueDetailScreen', () => 'VenueDetailScreen');

jest.mock('@react-navigation/bottom-tabs', () => ({
    createBottomTabNavigator: () => ({
        Navigator: ({ children }) => <>{children}</>,
        Screen: ({ name, component }) => <>{name} - {component}</>,
    }),
}));

jest.mock('@react-navigation/stack', () => ({
    createStackNavigator: () => ({
        Navigator: ({ children }) => <>{children}</>,
        Screen: ({ name, component }) => <>{name} - {component}</>,
    }),
}));

describe('MainNavigator', () => {
    it('renders without crashing', () => {
        render(
            <AuthProvider>
                <MainNavigator />
            </AuthProvider>
        );
    });
});

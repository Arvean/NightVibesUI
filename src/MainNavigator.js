import React from 'react';
// Importing navigation components from 'react-navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// Importing icons from 'lucide-react-native'
import {
  Home,
  Map,
  Users,
  Bell,
  User,
  Activity,
  MessageSquare,
} from 'lucide-react-native';

// Importing screens
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import VenueListScreen from './VenueListScreen';
import VenueDetailScreen from './VenueDetailScreen';
import FriendListScreen from './FriendListScreen';
import FriendDiscoveryScreen from './FriendDiscoveryScreen';
import FriendRequestsScreen from './FriendRequestsScreen';
import FriendActivityScreen from './FriendActivityScreen';
import NotificationScreen from './NotificationScreen';
import NotificationPreferencesScreen from './NotificationPreferencesScreen';
import ProfileScreen from './ProfileScreen';
import MeetupListScreen from './MeetupListScreen';

// Creating tab and stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Screen options for stack navigator
const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerTintColor: '#3b82f6',
};

/**
 * SocialStack Component:
 * - Stack navigator for social-related screens.
 * - Includes FriendActivity, FriendList, FriendDiscovery, FriendRequests, and MeetupList screens.
 */
const SocialStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Activity Feed Screen */}
    <Stack.Screen
      name="FriendActivity"
      component={FriendActivityScreen}
      options={{ title: 'Activity Feed' }}
    />
    {/* Friend List Screen */}
    <Stack.Screen
      name="FriendList"
      component={FriendListScreen}
      options={{ title: 'Friends' }}
    />
    {/* Friend Discovery Screen */}
    <Stack.Screen
      name="FriendDiscovery"
      component={FriendDiscoveryScreen}
      options={{ title: 'Find Friends' }}
    />
    {/* Friend Requests Screen */}
    <Stack.Screen
      name="FriendRequests"
      component={FriendRequestsScreen}
      options={{ title: 'Friend Requests' }}
    />
    {/* Meetup List Screen */}
    <Stack.Screen
      name="MeetupList"
      component={MeetupListScreen}
      options={{ title: 'Meetups' }}
    />
  </Stack.Navigator>
);

/**
 * VenueStack Component:
 * - Stack navigator for venue-related screens.
 * - Includes VenueList and VenueDetail screens.
 */
const VenueStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Venue List Screen */}
    <Stack.Screen
      name="VenueList"
      component={VenueListScreen}
      options={{ title: 'Venues' }}
    />
    {/* Venue Detail Screen */}
    <Stack.Screen
      name="VenueDetail"
      component={VenueDetailScreen}
      options={({ route }) => ({ title: route.params?.venue?.name || 'Venue' })}
    />
  </Stack.Navigator>
);

/**
 * NotificationStack Component:
 * - Stack navigator for notification-related screens.
 * - Includes NotificationScreen and NotificationPreferencesScreen.
 */
const NotificationStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Notification Screen */}
    <Stack.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{ title: 'Notifications' }}
    />
    {/* Notification Preferences Screen */}
    <Stack.Screen
      name="NotificationPreferences"
      component={NotificationPreferencesScreen}
      options={{ title: 'Notification Settings' }}
    />
  </Stack.Navigator>
);

/**
 * MainNavigator Component:
 * - Tab navigator for the main app screens.
 * - Includes Home, Map, Venues, Social, Notifications, and Profile screens.
 */
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f3f4f6',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      {/* Home Screen */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      {/* Map Screen */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      {/* Venues Screen */}
      <Tab.Screen
        name="Venues"
        component={VenueStack}
        options={{
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      {/* Social Screen */}
      <Tab.Screen
        name="Social"
        component={SocialStack}
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          tabBarLabel: 'Social',
        }}
      />
      {/* Notifications Screen */}
      <Tab.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      {/* Profile Screen */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

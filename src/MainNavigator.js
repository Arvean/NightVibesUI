// Import React.
import React from 'react';
// Importing navigation components from 'react-navigation'.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// Importing icons from 'lucide-react'.
import {
  Home,
  Map,
  Users,
  Bell,
  User,
  Activity,
  MessageSquare,
} from 'lucide-react';

// Importing screen components.
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
import CheckInScreen from './CheckInScreen';
import EditProfileScreen from './EditProfileScreen';

// Creating tab and stack navigators.
const Tab = createBottomTabNavigator(); // For bottom tab navigation
const Stack = createStackNavigator(); // For stack navigation

// Screen options for stack navigator.
// These options configure the appearance of the header for all screens within a stack.
const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff', // White background
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: '#f3f4f6', // Light gray border color
  },
  headerTitleStyle: {
    fontSize: 18, // Font size for the title
    fontWeight: '600', // Bold font weight
    color: '#111827', // Dark text color
  },
  headerTintColor: '#3b82f6', // Blue color for header text and back button
};

/**
 * SocialStack Component:
 * - Stack navigator for social-related screens.
 * - Includes FriendActivity, FriendList, FriendDiscovery, FriendRequests, and MeetupList screens.
 */
const SocialStack = () => (
  // Stack Navigator for social screens
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Activity Feed Screen */}
    <Stack.Screen
      name="FriendActivity"
      component={FriendActivityScreen}
      options={{ title: 'Activity Feed' }} // Screen title
    />
    {/* Friend List Screen */}
    <Stack.Screen
      name="FriendList"
      component={FriendListScreen}
      options={{ title: 'Friends' }} // Screen title
    />
    {/* Friend Discovery Screen */}
    <Stack.Screen
      name="FriendDiscovery"
      component={FriendDiscoveryScreen}
      options={{ title: 'Find Friends' }} // Screen title
    />
    {/* Friend Requests Screen */}
    <Stack.Screen
      name="FriendRequests"
      component={FriendRequestsScreen}
      options={{ title: 'Friend Requests' }} // Screen title
    />
    {/* Meetup List Screen */}
    <Stack.Screen
      name="MeetupList"
      component={MeetupListScreen}
      options={{ title: 'Meetups' }} // Screen title
    />
  </Stack.Navigator>
);

/**
 * VenueStack Component:
 * - Stack navigator for venue-related screens.
 * - Includes VenueList and VenueDetail screens.
 */
const VenueStack = () => (
  // Stack Navigator for venue screens
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Venue List Screen */}
    <Stack.Screen
      name="VenueList"
      component={VenueListScreen}
      options={{ title: 'Venues' }} // Screen title
    />
    {/* Venue Detail Screen */}
    <Stack.Screen
      name="VenueDetail"
      component={VenueDetailScreen}
      options={({ route }) => ({ title: route.params?.venue?.name || 'Venue' })} // Dynamic screen title
    />
  </Stack.Navigator>
);

/**
 * NotificationStack Component:
 * - Stack navigator for notification-related screens.
 * - Includes NotificationScreen and NotificationPreferencesScreen.
 */
const NotificationStack = () => (
  // Stack Navigator for notification screens
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Notification Screen */}
    <Stack.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{ title: 'Notifications' }} // Screen title
    />
    {/* Notification Preferences Screen */}
    <Stack.Screen
      name="NotificationPreferences"
      component={NotificationPreferencesScreen}
      options={{ title: 'Notification Settings' }} // Screen title
    />
  </Stack.Navigator>
);

// Stack navigator for the CheckIn Screen
const CheckInStack = () => (
  // Stack Navigator for the check-in screen
  <Stack.Navigator screenOptions={screenOptions}>
    {/* Check In Screen */}
    <Stack.Screen
      name="CheckIn"
      component={CheckInScreen}
      options={{ title: 'Check In' }} // Screen title
    />
  </Stack.Navigator>
);

// Stack navigator for the Profile and Edit Profile Screens
const ProfileStack = () => (
  // Stack Navigator for profile screens
    <Stack.Navigator screenOptions={screenOptions}>
        {/* Profile Screen */}
        <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }} // Screen title
        />
        {/* Edit Profile Screen */}
        <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }} // Screen title
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
    // Bottom tab navigator for main app navigation.
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff', // White background for the tab bar
          borderTopColor: '#f3f4f6', // Light gray border color
        },
        tabBarActiveTintColor: '#3b82f6', // Blue color for the active tab icon and label
        tabBarInactiveTintColor: '#6b7280', // Gray color for inactive tab icons and labels
        headerShown: false, // Hide the header for screens within the tab navigator
      }}
    >
      {/* Home Screen */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />, // Home icon
        }}
      />
      {/* Map Screen */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />, // Map icon
        }}
      />
      {/* Venues Screen (using VenueStack for nested navigation) */}
      <Tab.Screen
        name="Venues"
        component={VenueStack}
        options={{
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />, // Activity/Venues icon
        }}
      />
      {/* Social Screen (using SocialStack for nested navigation) */}
      <Tab.Screen
        name="Social"
        component={SocialStack}
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />, // Users/Social icon
          tabBarLabel: 'Social', // Set the tab label to 'Social'
        }}
      />
      {/* Notifications Screen (using NotificationStack for nested navigation) */}
      <Tab.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />, // Bell/Notifications icon
        }}
      />
      {/* Profile Screen (using ProfileStack for nested navigation) */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />, // User/Profile icon
        }}
      />
    </Tab.Navigator>
  );
}

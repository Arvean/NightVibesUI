import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
// Importing custom UI components.
import { Text, Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
// Importing icons from lucide-react-native.
import { ArrowLeft, Loader, Bell } from 'lucide-react-native';
// Importing the custom hook for managing notifications.
import useNotifications from './hooks/useNotifications';
// Importing the axios instance for API requests.
import axiosInstance from './axiosInstance';

// PreferenceItem component to display a single preference setting.
const PreferenceItem = ({ title, description, value, onValueChange }) => (
  <View className="flex-row items-center justify-between py-4">
    <View className="flex-1 mr-4">
      <Text className="font-medium">{title}</Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </View>
    {/* Custom Switch component for toggling the preference. */}
    <Switch checked={value} onCheckedChange={onValueChange} />
  </View>
);

// Main NotificationPreferencesScreen component.
export default function NotificationPreferencesScreen({ navigation }) {
  // Using the useNotifications hook to access the updatePreferences function.
  const { updatePreferences } = useNotifications();

  // State for storing the user's notification preferences.
  const [preferences, setPreferences] = useState({
    friend_requests: true,
    meetup_pings: true,
    venue_updates: true,
    friend_checkins: true,
    friends_nearby: true,
    push_enabled: true,
    email_enabled: false
  });
  // State for indicating whether data is loading.
  const [isLoading, setIsLoading] = useState(true);
  // State for indicating whether preferences are being saved.
  const [isSaving, setIsSaving] = useState(false);
  // State for storing any errors that occur.
  const [error, setError] = useState(null);

  // useEffect hook to fetch the user's notification preferences when the component mounts.
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        // Make a GET request to the API to get the user's notification preferences.
        const res = await axiosInstance.get('/api/notifications/preferences/');
        setPreferences(res.data);
      } catch (err) {
        setError('Failed to load preferences');
        console.error('Error fetching preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Handler for changing a preference setting.
  const handlePreferenceChange = async (key, value) => {
    // Optimistically update the local state.
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    setIsSaving(true);
    // Call the updatePreferences function from the useNotifications hook.
    const success = await updatePreferences(newPreferences);
    if (!success) {
      // Revert to the previous state if the update fails.
      setPreferences(preferences);
      setError('Failed to update preferences');
    }
    setIsSaving(false);
  };

  // Show loading indicator while data is loading.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  // Render the NotificationPreferencesScreen UI.
  return (
    <View className="flex-1 bg-background">
      {/* Header section with back button and title. */}
      <View className="p-4 border-b flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Text className="text-xl font-bold ml-2">Notification Settings</Text>
      </View>

      <View className="p-4">
        {/* Display error message if there's an error. */}
        {error && (
          <Text className="text-destructive mb-4">{error}</Text>
        )}

        {/* Card for displaying notification type preferences. */}
        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-semibold mb-4">Notification Types</Text>
            
            {/* PreferenceItem for friend requests. */}
            <PreferenceItem
              title="Friend Requests"
              description="Get notified when someone sends you a friend request"
              value={preferences.friend_requests}
              onValueChange={(value) => handlePreferenceChange('friend_requests', value)}
            />
            
            <View className="h-px bg-border" />
            
            {/* PreferenceItem for meetup pings. */}
            <PreferenceItem
              title="Meetup Pings"
              description="Get notified when friends want to meet up"
              value={preferences.meetup_pings}
              onValueChange={(value) => handlePreferenceChange('meetup_pings', value)}
            />
            
            <View className="h-px bg-border" />
            
            {/* PreferenceItem for venue updates. */}
            <PreferenceItem
              title="Venue Updates"
              description="Get notified about updates from your favorite venues"
              value={preferences.venue_updates}
              onValueChange={(value) => handlePreferenceChange('venue_updates', value)}
            />
            
            <View className="h-px bg-border" />
            
            {/* PreferenceItem for friend check-ins. */}
            <PreferenceItem
              title="Friend Check-ins"
              description="Get notified when friends check in nearby"
              value={preferences.friend_checkins}
              onValueChange={(value) => handlePreferenceChange('friend_checkins', value)}
            />
            
            <View className="h-px bg-border" />
            
            {/* PreferenceItem for friends nearby. */}
            <PreferenceItem
              title="Friends Nearby"
              description="Get notified when friends are in your area"
              value={preferences.friends_nearby}
              onValueChange={(value) => handlePreferenceChange('friends_nearby', value)}
            />
          </CardContent>
        </Card>

        {/* Card for displaying delivery method preferences. */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <Text className="text-lg font-semibold mb-4">Delivery Methods</Text>
            
            {/* PreferenceItem for push notifications. */}
            <PreferenceItem
              title="Push Notifications"
              description="Receive notifications on your device"
              value={preferences.push_enabled}
              onValueChange={(value) => handlePreferenceChange('push_enabled', value)}
            />
            
            <View className="h-px bg-border" />
            
            {/* PreferenceItem for email notifications. */}
            <PreferenceItem
              title="Email Notifications"
              description="Receive notifications via email"
              value={preferences.email_enabled}
              onValueChange={(value) => handlePreferenceChange('email_enabled', value)}
            />
          </CardContent>
        </Card>

        {/* Display a saving indicator while preferences are being updated. */}
        {isSaving && (
          <Text className="text-center text-muted-foreground mt-4">
            Saving preferences...
          </Text>
        )}
      </View>
    </View>
  );
}

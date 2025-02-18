import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader, Bell } from 'lucide-react-native';
import useNotifications from './hooks/useNotifications';
import axiosInstance from './axiosInstance';

const PreferenceItem = ({ title, description, value, onValueChange }) => (
  <View className="flex-row items-center justify-between py-4">
    <View className="flex-1 mr-4">
      <Text className="font-medium">{title}</Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </View>
    <Switch checked={value} onCheckedChange={onValueChange} />
  </View>
);

export default function NotificationPreferencesScreen({ navigation }) {
  const { updatePreferences } = useNotifications();
  const [preferences, setPreferences] = useState({
    friend_requests: true,
    meetup_pings: true,
    venue_updates: true,
    friend_checkins: true,
    friends_nearby: true,
    push_enabled: true,
    email_enabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
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

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    setIsSaving(true);
    const success = await updatePreferences(newPreferences);
    if (!success) {
      // Revert on failure
      setPreferences(preferences);
      setError('Failed to update preferences');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
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
        {error && (
          <Text className="text-destructive mb-4">{error}</Text>
        )}

        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-semibold mb-4">Notification Types</Text>
            
            <PreferenceItem
              title="Friend Requests"
              description="Get notified when someone sends you a friend request"
              value={preferences.friend_requests}
              onValueChange={(value) => handlePreferenceChange('friend_requests', value)}
            />
            
            <View className="h-px bg-border" />
            
            <PreferenceItem
              title="Meetup Pings"
              description="Get notified when friends want to meet up"
              value={preferences.meetup_pings}
              onValueChange={(value) => handlePreferenceChange('meetup_pings', value)}
            />
            
            <View className="h-px bg-border" />
            
            <PreferenceItem
              title="Venue Updates"
              description="Get notified about updates from your favorite venues"
              value={preferences.venue_updates}
              onValueChange={(value) => handlePreferenceChange('venue_updates', value)}
            />
            
            <View className="h-px bg-border" />
            
            <PreferenceItem
              title="Friend Check-ins"
              description="Get notified when friends check in nearby"
              value={preferences.friend_checkins}
              onValueChange={(value) => handlePreferenceChange('friend_checkins', value)}
            />
            
            <View className="h-px bg-border" />
            
            <PreferenceItem
              title="Friends Nearby"
              description="Get notified when friends are in your area"
              value={preferences.friends_nearby}
              onValueChange={(value) => handlePreferenceChange('friends_nearby', value)}
            />
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardContent className="p-4">
            <Text className="text-lg font-semibold mb-4">Delivery Methods</Text>
            
            <PreferenceItem
              title="Push Notifications"
              description="Receive notifications on your device"
              value={preferences.push_enabled}
              onValueChange={(value) => handlePreferenceChange('push_enabled', value)}
            />
            
            <View className="h-px bg-border" />
            
            <PreferenceItem
              title="Email Notifications"
              description="Receive notifications via email"
              value={preferences.email_enabled}
              onValueChange={(value) => handlePreferenceChange('email_enabled', value)}
            />
          </CardContent>
        </Card>

        {isSaving && (
          <Text className="text-center text-muted-foreground mt-4">
            Saving preferences...
          </Text>
        )}
      </View>
    </View>
  );
}

import React, { useEffect } from 'react';
// Importing necessary components from 'react-native'
import { View, StyleSheet, RefreshControl } from 'react-native';
// Importing UI components from '@/components/ui/*'
import { Text, Button } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Importing icons from 'lucide-react-native'
import {
  Settings,
  Loader,
  Bell,
  UserPlus,
  MapPin,
  Users,
  Activity,
  X,
  Check,
  MessageSquare
} from 'lucide-react-native';
// Importing custom hook for notifications
import useNotifications, { NOTIFICATION_TYPES } from './hooks/useNotifications';

/**
 * NotificationIcon Component:
 * - Renders an icon based on the notification type.
 */
const NotificationIcon = ({ type }) => {
  switch (type) {
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case NOTIFICATION_TYPES.MEETUP_PING:
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case NOTIFICATION_TYPES.VENUE_UPDATE:
      return <MapPin className="h-5 w-5 text-purple-500" />;
    case NOTIFICATION_TYPES.CHECK_IN:
      return <Activity className="h-5 w-5 text-orange-500" />;
    case NOTIFICATION_TYPES.FRIEND_NEARBY:
      return <Users className="h-5 w-5 text-pink-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

/**
 * NotificationActions Component:
 * - Renders action buttons based on the notification type.
 * - Allows accepting, declining, or viewing notification details.
 */
const NotificationActions = ({ type, data, onAccept, onDecline, onView }) => {
  switch (type) {
    case NOTIFICATION_TYPES.FRIEND_REQUEST:
      return (
        <View className="flex-row gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onPress={() => onAccept(data)}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onPress={() => onDecline(data)}
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </View>
      );
    case NOTIFICATION_TYPES.MEETUP_PING:
      return (
        <View className="flex-row gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onPress={() => onAccept(data)}
          >
            <Check className="h-4 w-4 mr-2" />
            Join
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onPress={() => onDecline(data)}
          >
            <X className="h-4 w-4 mr-2" />
            Skip
          </Button>
        </View>
      );
    default:
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onPress={() => onView(data)}
        >
          View Details
        </Button>
      );
  }
};

/**
 * NotificationCard Component:
 * - Renders a card displaying notification information and actions.
 */
const NotificationCard = ({ notification, onAction, onDelete }) => (
  <Card className={`mb-4 ${!notification.is_read ? 'bg-primary/5' : ''}`}>
    <CardContent className="p-4">
      <View className="flex-row items-start">
        <NotificationIcon type={notification.type} />
        <View className="flex-1 ml-3">
          <Text className="font-medium">{notification.title}</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            {new Date(notification.created_at).toLocaleString()}
          </Text>
          <NotificationActions
            type={notification.type}
            data={notification.data}
            onAccept={() => onAction('accept', notification)}
            onDecline={() => onAction('decline', notification)}
            onView={() => onAction('view', notification)}
          />
        </View>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onPress={() => onDelete(notification)}
        >
          <X className="h-4 w-4" />
        </Button>
      </View>
    </CardContent>
  </Card>
);

/**
 * EmptyState Component:
 * - Renders a message when there are no notifications.
 */
const EmptyState = () => (
  <View className="flex-1 items-center justify-center p-8">
    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
    <Text className="text-xl font-semibold text-center mb-2">
      No Notifications
    </Text>
    <Text className="text-muted-foreground text-center">
      You're all caught up! Check back later for updates.
    </Text>
  </View>
);

/**
 * NotificationScreen Component:
 * - Displays a list of notifications.
 * - Allows users to view, accept, decline, and delete notifications.
 * - Fetches notifications using a custom hook.
 */
export default function NotificationScreen({ navigation }) {
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    clearAll,
    unreadCount
  } = useNotifications();

  // useEffect hook to fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Function to handle notification actions (accept, decline, view)
  const handleAction = async (action, notification) => {
    await markAsRead(notification.id);
    
    switch (action) {
      case 'accept':
        // Transition to different screens based on notification type
        if (notification.type === NOTIFICATION_TYPES.FRIEND_REQUEST) {
          navigation.navigate('FriendRequests');
        } else if (notification.type === NOTIFICATION_TYPES.MEETUP_PING) {
          navigation.navigate('MeetupDetails', { id: notification.data.meetup_id });
        }
        break;
      case 'decline':
        await deleteNotification(notification.id);
        break;
      case 'view':
        // Transition to different screens based on notification type
        switch (notification.type) {
          case NOTIFICATION_TYPES.VENUE_UPDATE:
            navigation.navigate('VenueDetails', { id: notification.data.venue_id });
            break;
          case NOTIFICATION_TYPES.CHECK_IN:
            navigation.navigate('VenueDetails', { id: notification.data.venue_id });
            break;
          case NOTIFICATION_TYPES.FRIEND_NEARBY:
            navigation.navigate('Map', { friendId: notification.data.friend_id });
            break;
        }
        break;
    }
  };

  // Conditional rendering based on loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  // Main return statement for rendering the NotificationScreen component
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="p-4 border-b">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold">Notifications</Text>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </View>
          <View className="flex-row gap-2">
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onPress={clearAll}
              >
                Clear All
              </Button>
            )}
            {/* Button to navigate to NotificationPreferencesScreen */}
            <Button
              variant="ghost"
              size="icon"
              onPress={() => navigation.navigate('NotificationPreferences')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </View>
        </View>
      </View>

      {/* Display error message if there is an error */}
      {error && (
        <Text className="text-destructive p-4">{error}</Text>
      )}

      <ScrollArea
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchNotifications}
          />
        }
      >
        <View className="p-4">
          {/* Render notifications or empty state */}
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onAction={handleAction}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollArea>
    </View>
  );
}

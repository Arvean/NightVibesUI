import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
// Importing custom UI components.
import { Text, Button } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Importing icons from lucide-react-native.
import { UserPlus, Loader, Users, Check, X } from 'lucide-react-native';
// Importing the custom hook for managing friend requests.
import useFriendRequests from './hooks/useFriendRequests';

// RequestCard component to display individual friend requests.
const RequestCard = ({ request, onAccept, onDecline }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        {/* Sender's avatar. */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={request.sender.profile_picture} />
          <AvatarFallback>{request.sender.username[0]}</AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-4">
          <Text className="font-semibold">{request.sender.username}</Text>
          {/* Display sender's name if available. */}
          {request.sender.name && (
            <Text className="text-sm text-muted-foreground">
              {request.sender.name}
            </Text>
          )}
          {/* Display mutual friends count if greater than 0. */}
          {request.sender.mutual_friends_count > 0 && (
            <Text className="text-xs text-muted-foreground">
              {request.sender.mutual_friends_count} mutual friends
            </Text>
          )}
          <Text className="text-xs text-muted-foreground">
            Sent {new Date(request.created_at).toLocaleDateString()}
          </Text>
        </View>
        {/* Buttons to accept or decline the request. */}
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-green-500/10 hover:bg-green-500/20"
            onPress={() => onAccept(request)}
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-500/10 hover:bg-red-500/20"
            onPress={() => onDecline(request)}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </View>
      </View>
    </CardContent>
  </Card>
);

// EmptyState component to display when there are no friend requests.
const EmptyState = ({ onDiscoverFriends }) => (
  <View className="flex-1 items-center justify-center p-8">
    <Users className="h-12 w-12 text-muted-foreground mb-4" />
    <Text className="text-xl font-semibold text-center mb-2">
      No Friend Requests
    </Text>
    <Text className="text-muted-foreground text-center mb-6">
      You don't have any pending friend requests at the moment
    </Text>
    {/* Button to navigate to the friend discovery screen. */}
    <Button className="gap-2" onPress={onDiscoverFriends}>
      <UserPlus className="h-4 w-4" />
      Find Friends
    </Button>
  </View>
);

// SentRequestsSection component to display sent friend requests.
const SentRequestsSection = ({ requests, onCancel }) => (
  <View className="mb-6">
    <Text className="text-lg font-semibold mb-4">Sent Requests</Text>
    {/* Map through sent requests and display a card for each. */}
    {requests.map(request => (
      <Card key={request.id} className="mb-4">
        <CardContent className="p-4">
          <View className="flex-row items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.recipient.profile_picture} />
              <AvatarFallback>{request.recipient.username[0]}</AvatarFallback>
            </Avatar>
            <View className="flex-1 ml-4">
              <Text className="font-semibold">{request.recipient.username}</Text>
              <Text className="text-xs text-muted-foreground">
                Sent {new Date(request.created_at).toLocaleDateString()}
              </Text>
            </View>
            {/* Button to cancel the sent request. */}
            <Button
              variant="outline"
              size="sm"
              onPress={() => onCancel(request)}
            >
              Cancel
            </Button>
          </View>
        </CardContent>
      </Card>
    ))}
  </View>
);

// Main FriendRequestsScreen component.
export default function FriendRequestsScreen({ navigation }) {
  // Using the useFriendRequests hook to manage state and side effects.
  const {
    requests, // List of received friend requests.
    sentRequests, // List of sent friend requests.
    isLoading, // Boolean indicating whether data is loading.
    error, // Error message, if any.
    fetchRequests, // Function to fetch friend requests.
    acceptRequest, // Function to accept a friend request.
    declineRequest, // Function to decline a friend request.
    cancelRequest // Function to cancel a sent friend request.
  } = useFriendRequests();

  // Fetch friend requests when the component mounts.
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handler for accepting a friend request.
  const handleAccept = async (request) => {
    const success = await acceptRequest(request.id);
    if (success) {
      // Show success toast (implementation not shown)
    }
  };

  // Handler for declining a friend request.
  const handleDecline = async (request) => {
    const success = await declineRequest(request.id);
    if (success) {
      // Show success toast (implementation not shown)
    }
  };

  // Handler for canceling a sent friend request.
  const handleCancel = async (request) => {
    const success = await cancelRequest(request.id);
    if (success) {
      // Show success toast (implementation not shown)
    }
  };

  // Show loading indicator while data is loading.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  // Render the FriendRequestsScreen UI.
  return (
    <View className="flex-1 bg-background">
      {/* Header section with title and button to find friends. */}
      <View className="p-4 border-b">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold">Friend Requests</Text>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('FriendDiscovery')}
          >
            Find Friends
          </Button>
        </View>
      </View>

      {/* Display error message if there's an error. */}
      {error && (
        <Text className="text-destructive p-4">{error}</Text>
      )}

      {/* Scrollable area for content. */}
      <ScrollArea
        refreshControl={
          // Add a RefreshControl for pull-to-refresh functionality.
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRequests}
          />
        }
      >
        <View className="p-4">
          {/* Display pending friend requests if there are any. */}
          {requests.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4">
                Pending Requests ({requests.length})
              </Text>
              {requests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </View>
          )}

          {/* Display sent friend requests if there are any. */}
          {sentRequests.length > 0 && (
            <SentRequestsSection
              requests={sentRequests}
              onCancel={handleCancel}
            />
          )}

          {/* Display empty state if there are no pending or sent requests. */}
          {requests.length === 0 && sentRequests.length === 0 && (
            <EmptyState
              onDiscoverFriends={() => navigation.navigate('FriendDiscovery')}
            />
          )}
        </View>
      </ScrollArea>
    </View>
  );
}

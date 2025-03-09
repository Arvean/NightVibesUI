import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
// Importing custom UI components.
import { Text, Button, Input } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Importing custom alert dialog components.
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Importing icons from lucide-react-native.
import { Search, UserPlus, UserMinus, MessageSquare, Loader, Users } from 'lucide-react-native';
// Importing the custom hook for managing friends.
import useFriends from './hooks/useFriends';

// FriendCard component to display individual friend information.
const FriendCard = ({ friend, onRemove, onMessage }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        {/* Friend's avatar. */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={friend.profile_picture} />
          <AvatarFallback>{friend.username[0]}</AvatarFallback>
        </Avatar>
        <View className="ml-4 flex-1">
          <Text className="font-semibold">{friend.username}</Text>
          {/* Display friend's name if available. */}
          {friend.name && (
            <Text className="text-sm text-muted-foreground">{friend.name}</Text>
          )}
          {/* Display friend's last seen time if available. */}
          {friend.last_seen && (
            <Text className="text-xs text-muted-foreground">
              Last seen: {new Date(friend.last_seen).toLocaleString()}
            </Text>
          )}
        </View>
        <View className="flex-row gap-2">
          {/* Button to message the friend. */}
          <Button
            variant="ghost"
            size="icon"
            onPress={() => onMessage(friend)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          {/* Alert dialog for confirming friend removal. */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
              >
                <UserMinus className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {friend.username} from your friends list?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => onRemove(friend)}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </View>
    </CardContent>
  </Card>
);

// EmptyState component to display when the user has no friends.
const EmptyState = () => (
  <View className="flex-1 items-center justify-center p-8">
    <Users className="h-12 w-12 text-muted-foreground mb-4" />
    <Text className="text-xl font-semibold text-center mb-2">
      No Friends Yet
    </Text>
    <Text className="text-muted-foreground text-center mb-6">
      Start connecting with other nightlife enthusiasts
    </Text>
    <Button>
      Find Friends
    </Button>
  </View>
);

// Main FriendListScreen component.
export default function FriendListScreen({ navigation }) {
  // Using the useFriends hook to manage state and side effects.
  const {
    friends, // List of the user's friends.
    isLoading, // Boolean indicating whether data is loading.
    error, // Error message, if any.
    searchQuery, // The current search query.
    fetchFriends, // Function to fetch the user's friends.
    removeFriend, // Function to remove a friend.
    searchFriends // Function to search for friends
  } = useFriends();

  // Fetch friends when the component mounts.
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Handler for removing a friend.
  const handleRemoveFriend = async (friend) => {
    const success = await removeFriend(friend.id);
    if (success) {
      // Show success toast (implementation not shown)
    }
  };

  // Handler for messaging a friend.
  const handleMessage = (friend) => {
    // Navigate to chat or show meetup options
    navigation.navigate('Chat', { friendId: friend.id });
  };

  // Show loading indicator while data is loading.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  // Show error message if there's an error.
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive text-center mb-4">{error}</Text>
        <Button onPress={fetchFriends}>Try Again</Button>
      </View>
    );
  }

  // Render the FriendListScreen UI.
  return (
    <View className="flex-1 bg-background">
      {/* Header section with title and search input. */}
      <View className="p-4 border-b">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold">Friends</Text>
          <Button
            variant="outline"
            onPress={() => navigation.navigate('FriendRequests')}
          >
            Friend Requests
          </Button>
        </View>
        
        <View className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={searchFriends}
            className="pl-9"
          />
        </View>
      </View>

      {/* Scrollable area for the friend list. */}
      <ScrollArea
        refreshControl={
          // Add a RefreshControl for pull-to-refresh functionality.
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchFriends}
          />
        }
      >
        <View className="p-4">
          {/* Display the friend list if there are friends, otherwise show the empty state. */}
          {friends.length > 0 ? (
            friends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={handleRemoveFriend}
                onMessage={handleMessage}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

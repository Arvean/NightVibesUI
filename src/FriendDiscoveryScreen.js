import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
// Importing custom UI components.  These appear to be defined using a custom UI library.
import { Text, Button, Input } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Importing icons from lucide-react-native.
import { Search, UserPlus, Loader, Users, RefreshCcw } from 'lucide-react-native';
// Importing the custom hook for friend discovery logic.
import useFriendDiscovery from './hooks/useFriendDiscovery';

// UserCard component to display individual user information.
const UserCard = ({ user, onSendRequest }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        {/* User avatar. */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profile_picture} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-4">
          <Text className="font-semibold">{user.username}</Text>
          {/* Display user's name if available. */}
          {user.name && (
            <Text className="text-sm text-muted-foreground">
              {user.name}
            </Text>
          )}
          {/* Display mutual friends count if greater than 0. */}
          {user.mutual_friends_count > 0 && (
            <Text className="text-xs text-muted-foreground">
              {user.mutual_friends_count} mutual friends
            </Text>
          )}
          {/* Display common venues if available. */}
          {user.common_venues?.length > 0 && (
            <Text className="text-xs text-muted-foreground">
              Visits {user.common_venues.join(', ')}
            </Text>
          )}
        </View>
        {/* Button to send a friend request. */}
        <Button
          variant={user.request_sent ? "outline" : "default"}
          size="sm"
          disabled={user.request_sent}
          onPress={() => onSendRequest(user)}
        >
          {user.request_sent ? (
            "Request Sent"
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </>
          )}
        </Button>
      </View>
    </CardContent>
  </Card>
);

// SuggestionsSection component to display suggested friends.
const SuggestionsSection = ({ suggestions, onSendRequest, onRefresh }) => (
  <View className="mb-6">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-semibold">Suggested Friends</Text>
      {/* Button to refresh the suggestions. */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onPress={onRefresh}
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </Button>
    </View>
    {/* Map through the suggestions and display a UserCard for each. */}
    {suggestions.map(user => (
      <UserCard
        key={user.id}
        user={user}
        onSendRequest={onSendRequest}
      />
    ))}
  </View>
);

// SearchResults component to display search results.
const SearchResults = ({ users, onSendRequest }) => (
  <View>
    <Text className="text-lg font-semibold mb-4">Search Results</Text>
    {/* Map through the search results and display a UserCard for each. */}
    {users.map(user => (
      <UserCard
        key={user.id}
        user={user}
        onSendRequest={onSendRequest}
      />
    ))}
  </View>
);

// EmptyState component to display when there are no suggestions or search results.
const EmptyState = () => (
  <View className="flex-1 items-center justify-center p-8">
    <Users className="h-12 w-12 text-muted-foreground mb-4" />
    <Text className="text-xl font-semibold text-center mb-2">
      Find New Friends
    </Text>
    <Text className="text-muted-foreground text-center">
      Search for users or check out our suggestions to connect with more people
    </Text>
  </View>
);

// Main FriendDiscoveryScreen component.
export default function FriendDiscoveryScreen({ navigation }) {
  // Using the useFriendDiscovery hook to manage state and side effects.
  const {
    suggestions, // List of suggested friends.
    discoveredUsers, // List of users found through search.
    isLoading, // Boolean indicating whether data is loading.
    error, // Error message, if any.
    searchQuery, // The current search query.
    fetchSuggestions, // Function to fetch friend suggestions.
    searchUsers, // Function to search for users.
    sendFriendRequest, // Function to send a friend request.
    refreshSuggestions // Function to refresh the suggestions
  } = useFriendDiscovery();

  // Fetch suggestions when the component mounts.
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Handler for search input changes.
  const handleSearch = (text) => {
    searchUsers(text);
  };

  // Handler for sending a friend request.
  const handleSendRequest = async (user) => {
    const success = await sendFriendRequest(user.id);
    if (success) {
      // Show success toast (implementation not shown, likely a custom notification)
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header section with title and search input. */}
      <View className="p-4 border-b">
        <Text className="text-2xl font-bold mb-4">Discover Friends</Text>
        <View className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={handleSearch}
            className="pl-9"
          />
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
            onRefresh={fetchSuggestions}
          />
        }
      >
        <View className="p-4">
          {/* Show loading indicator while data is loading. */}
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
            </View>
          ) : searchQuery ? ( // If there's a search query, show search results.
            discoveredUsers.length > 0 ? (
              <SearchResults
                users={discoveredUsers}
                onSendRequest={handleSendRequest}
              />
            ) : (
              <Text className="text-center text-muted-foreground py-8">
                No users found matching "{searchQuery}"
              </Text>
            )
          ) : suggestions.length > 0 ? ( // If there are suggestions, show the suggestions section.
            <SuggestionsSection
              suggestions={suggestions}
              onSendRequest={handleSendRequest}
              onRefresh={refreshSuggestions}
            />
          ) : ( // Otherwise, show the empty state.
            <EmptyState />
          )}
        </View>
      </ScrollArea>
    </View>
  );
}

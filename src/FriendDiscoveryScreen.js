import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Button, Input } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Loader, Users, RefreshCcw } from 'lucide-react-native';
import useFriendDiscovery from './hooks/useFriendDiscovery';

const UserCard = ({ user, onSendRequest }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profile_picture} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-4">
          <Text className="font-semibold">{user.username}</Text>
          {user.name && (
            <Text className="text-sm text-muted-foreground">
              {user.name}
            </Text>
          )}
          {user.mutual_friends_count > 0 && (
            <Text className="text-xs text-muted-foreground">
              {user.mutual_friends_count} mutual friends
            </Text>
          )}
          {user.common_venues?.length > 0 && (
            <Text className="text-xs text-muted-foreground">
              Visits {user.common_venues.join(', ')}
            </Text>
          )}
        </View>
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

const SuggestionsSection = ({ suggestions, onSendRequest, onRefresh }) => (
  <View className="mb-6">
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-semibold">Suggested Friends</Text>
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
    {suggestions.map(user => (
      <UserCard
        key={user.id}
        user={user}
        onSendRequest={onSendRequest}
      />
    ))}
  </View>
);

const SearchResults = ({ users, onSendRequest }) => (
  <View>
    <Text className="text-lg font-semibold mb-4">Search Results</Text>
    {users.map(user => (
      <UserCard
        key={user.id}
        user={user}
        onSendRequest={onSendRequest}
      />
    ))}
  </View>
);

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

export default function FriendDiscoveryScreen({ navigation }) {
  const {
    suggestions,
    discoveredUsers,
    isLoading,
    error,
    searchQuery,
    fetchSuggestions,
    searchUsers,
    sendFriendRequest,
    refreshSuggestions
  } = useFriendDiscovery();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSearch = (text) => {
    searchUsers(text);
  };

  const handleSendRequest = async (user) => {
    const success = await sendFriendRequest(user.id);
    if (success) {
      // Show success toast
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
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

      {error && (
        <Text className="text-destructive p-4">{error}</Text>
      )}

      <ScrollArea
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchSuggestions}
          />
        }
      >
        <View className="p-4">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
            </View>
          ) : searchQuery ? (
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
          ) : suggestions.length > 0 ? (
            <SuggestionsSection
              suggestions={suggestions}
              onSendRequest={handleSendRequest}
              onRefresh={refreshSuggestions}
            />
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollArea>
    </View>
  );
}

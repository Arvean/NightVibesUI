import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Button, Input } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Search, UserPlus, UserMinus, MessageSquare, Loader, Users } from 'lucide-react-native';
import useFriends from './hooks/useFriends';

const FriendCard = ({ friend, onRemove, onMessage }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={friend.profile_picture} />
          <AvatarFallback>{friend.username[0]}</AvatarFallback>
        </Avatar>
        <View className="ml-4 flex-1">
          <Text className="font-semibold">{friend.username}</Text>
          {friend.name && (
            <Text className="text-sm text-muted-foreground">{friend.name}</Text>
          )}
          {friend.last_seen && (
            <Text className="text-xs text-muted-foreground">
              Last seen: {new Date(friend.last_seen).toLocaleString()}
            </Text>
          )}
        </View>
        <View className="flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => onMessage(friend)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
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

export default function FriendListScreen({ navigation }) {
  const {
    friends,
    isLoading,
    error,
    searchQuery,
    fetchFriends,
    removeFriend,
    searchFriends
  } = useFriends();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleRemoveFriend = async (friend) => {
    const success = await removeFriend(friend.id);
    if (success) {
      // Show success toast
    }
  };

  const handleMessage = (friend) => {
    // Navigate to chat or show meetup options
    navigation.navigate('Chat', { friendId: friend.id });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive text-center mb-4">{error}</Text>
        <Button onPress={fetchFriends}>Try Again</Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
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

      {/* Friend List */}
      <ScrollArea
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchFriends}
          />
        }
      >
        <View className="p-4">
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

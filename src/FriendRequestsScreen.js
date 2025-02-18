import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Button } from '@/components/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Loader, Users, Check, X } from 'lucide-react-native';
import useFriendRequests from './hooks/useFriendRequests';

const RequestCard = ({ request, onAccept, onDecline }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <View className="flex-row items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={request.sender.profile_picture} />
          <AvatarFallback>{request.sender.username[0]}</AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-4">
          <Text className="font-semibold">{request.sender.username}</Text>
          {request.sender.name && (
            <Text className="text-sm text-muted-foreground">
              {request.sender.name}
            </Text>
          )}
          {request.sender.mutual_friends_count > 0 && (
            <Text className="text-xs text-muted-foreground">
              {request.sender.mutual_friends_count} mutual friends
            </Text>
          )}
          <Text className="text-xs text-muted-foreground">
            Sent {new Date(request.created_at).toLocaleDateString()}
          </Text>
        </View>
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

const EmptyState = ({ onDiscoverFriends }) => (
  <View className="flex-1 items-center justify-center p-8">
    <Users className="h-12 w-12 text-muted-foreground mb-4" />
    <Text className="text-xl font-semibold text-center mb-2">
      No Friend Requests
    </Text>
    <Text className="text-muted-foreground text-center mb-6">
      You don't have any pending friend requests at the moment
    </Text>
    <Button className="gap-2" onPress={onDiscoverFriends}>
      <UserPlus className="h-4 w-4" />
      Find Friends
    </Button>
  </View>
);

const SentRequestsSection = ({ requests, onCancel }) => (
  <View className="mb-6">
    <Text className="text-lg font-semibold mb-4">Sent Requests</Text>
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

export default function FriendRequestsScreen({ navigation }) {
  const {
    requests,
    sentRequests,
    isLoading,
    error,
    fetchRequests,
    acceptRequest,
    declineRequest,
    cancelRequest
  } = useFriendRequests();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (request) => {
    const success = await acceptRequest(request.id);
    if (success) {
      // Show success toast
    }
  };

  const handleDecline = async (request) => {
    const success = await declineRequest(request.id);
    if (success) {
      // Show success toast
    }
  };

  const handleCancel = async (request) => {
    const success = await cancelRequest(request.id);
    if (success) {
      // Show success toast
    }
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

      {error && (
        <Text className="text-destructive p-4">{error}</Text>
      )}

      <ScrollArea
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchRequests}
          />
        }
      >
        <View className="p-4">
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

          {sentRequests.length > 0 && (
            <SentRequestsSection
              requests={sentRequests}
              onCancel={handleCancel}
            />
          )}

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

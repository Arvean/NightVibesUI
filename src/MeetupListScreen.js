import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MessageSquare,
} from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { ScreenErrorBoundary } from './components/ErrorBoundary';
import { MeetupPingSkeleton } from './components/Skeleton';
import { Stagger, SlideIn, Scale } from './components/Animated';
import useMeetupPings from './hooks/useMeetupPings';
import { format } from 'date-fns';

const MeetupPingItem = ({ ping, onRespond, onCancel }) => {
  const { colors } = useTheme();
  const [isRespondLoading, setIsRespondLoading] = React.useState(false);

  const handleRespond = async (status) => {
    try {
      setIsRespondLoading(true);
      await onRespond(ping.id, status);
    } finally {
      setIsRespondLoading(false);
    }
  };

  const renderStatus = () => {
    switch (ping.status) {
      case 'accepted':
        return (
          <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={[styles.statusText, { color: colors.success }]}>
              Accepted
            </Text>
          </View>
        );
      case 'declined':
        return (
          <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
            <XCircle size={16} color={colors.error} />
            <Text style={[styles.statusText, { color: colors.error }]}>
              Declined
            </Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}>
            <Clock size={16} color={colors.warning} />
            <Text style={[styles.statusText, { color: colors.warning }]}>
              Pending
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Scale>
      <View
        style={[
          styles.pingItem,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.pingHeader}>
          <View style={styles.userInfo}>
            <User size={20} color={colors.textSecondary} />
            <Text style={[styles.username, { color: colors.text }]}>
              {ping.is_sender ? ping.receiver.username : ping.sender.username}
            </Text>
          </View>
          {renderStatus()}
        </View>

        <View style={styles.venueInfo}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={[styles.venueName, { color: colors.text }]}>
            {ping.venue.name}
          </Text>
        </View>

        {ping.message && (
          <View style={styles.messageContainer}>
            <MessageSquare size={16} color={colors.textSecondary} />
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {ping.message}
            </Text>
          </View>
        )}

        <View style={styles.timeInfo}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {format(new Date(ping.created_at), 'MMM d, h:mm a')}
          </Text>
        </View>

        {ping.status === 'pending' && (
          <View
            style={[
              styles.actions,
              { borderTopColor: colors.border },
            ]}
          >
            {ping.is_sender ? (
              <Button
                title="Cancel Request"
                variant="outline"
                onPress={() => onCancel(ping.id)}
                style={styles.actionButton}
                disabled={isRespondLoading}
              />
            ) : (
              <>
                <Button
                  title="Accept"
                  onPress={() => handleRespond('accept')}
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                  disabled={isRespondLoading}
                />
                <Button
                  title="Decline"
                  variant="outline"
                  onPress={() => handleRespond('decline')}
                  style={[styles.actionButton, { borderColor: colors.error }]}
                  disabled={isRespondLoading}
                />
              </>
            )}
          </View>
        )}

        {ping.response_message && (
          <View
            style={[
              styles.responseMessage,
              { backgroundColor: colors.surfaceHighlight },
            ]}
          >
            <Text style={[styles.responseLabel, { color: colors.text }]}>
              Response:
            </Text>
            <Text style={[styles.responseText, { color: colors.textSecondary }]}>
              {ping.response_message}
            </Text>
          </View>
        )}
      </View>
    </Scale>
  );
};

const MeetupListScreen = () => {
  const {
    pings,
    isLoading,
    error,
    refreshPings,
    respondToPing,
    cancelPing,
  } = useMeetupPings();
  const { colors } = useTheme();

  const renderContent = () => {
    if (isLoading && !pings.length) {
      return (
        <Stagger>
          {[...Array(3)].map((_, index) => (
            <MeetupPingSkeleton key={index} />
          ))}
        </Stagger>
      );
    }

    return (
      <FlatList
        data={pings}
        renderItem={({ item }) => (
          <MeetupPingItem
            ping={item}
            onRespond={respondToPing}
            onCancel={cancelPing}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshPings}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No meetup requests
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <ScreenErrorBoundary onReset={refreshPings}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {renderContent()}
      </SafeAreaView>
    </ScreenErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  pingItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  pingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  venueName: {
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
  },
  responseMessage: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default MeetupListScreen;

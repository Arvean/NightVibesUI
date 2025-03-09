import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
// Importing custom UI components.
import { Text, Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importing icons from lucide-react-native.
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MessageSquare,
} from 'lucide-react-native';
// Importing the theme context.
import { useTheme } from './context/ThemeContext';
// Importing custom components for error handling and skeleton loading.
import { ScreenErrorBoundary } from './components/ErrorBoundary';
import { MeetupPingSkeleton } from './components/Skeleton';
// Importing a custom animation component.
import { Stagger, SlideIn, Scale } from './components/Animated';
// Importing the custom hook for managing meetup pings.
import useMeetupPings from './hooks/useMeetupPings';
// Importing date-fns for date formatting.
import { format } from 'date-fns';

// MeetupPingItem component to display individual meetup ping information.
const MeetupPingItem = ({ ping, onRespond, onCancel }) => {
  const { colors } = useTheme();
  const [isRespondLoading, setIsRespondLoading] = React.useState(false);

  // Handler for responding to a meetup ping (accept/decline).
  const handleRespond = async (status) => {
    try {
      setIsRespondLoading(true);
      await onRespond(ping.id, status);
    } finally {
      setIsRespondLoading(false);
    }
  };

  // Function to render the status badge based on the ping's status.
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
        {/* Header section with user info and status. */}
        <View style={styles.pingHeader}>
          <View style={styles.userInfo}>
            <User size={20} color={colors.textSecondary} />
            <Text style={[styles.username, { color: colors.text }]}>
              {/* Display the receiver's username if the user is the sender, otherwise display the sender's username. */}
              {ping.is_sender ? ping.receiver.username : ping.sender.username}
            </Text>
          </View>
          {renderStatus()}
        </View>

        {/* Venue information. */}
        <View style={styles.venueInfo}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={[styles.venueName, { color: colors.text }]}>
            {ping.venue.name}
          </Text>
        </View>

        {/* Display the meetup message if available. */}
        {ping.message && (
          <View style={styles.messageContainer}>
            <MessageSquare size={16} color={colors.textSecondary} />
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {ping.message}
            </Text>
          </View>
        )}

        {/* Display the creation time of the meetup ping. */}
        <View style={styles.timeInfo}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {format(new Date(ping.created_at), 'MMM d, h:mm a')}
          </Text>
        </View>

        {/* Display action buttons (accept/decline or cancel) if the ping is pending. */}
        {ping.status === 'pending' && (
          <View
            style={[
              styles.actions,
              { borderTopColor: colors.border },
            ]}
          >
            {/* Show "Cancel Request" for the sender. */}
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
                {/* Show "Accept" and "Decline" buttons for the receiver. */}
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

        {/* Display the response message if available. */}
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

// Main MeetupListScreen component.
const MeetupListScreen = () => {
  // Using the useMeetupPings hook to manage state and side effects.
  const {
    pings, // List of meetup pings.
    isLoading, // Boolean indicating whether data is loading.
    error, // Error message, if any.
    refreshPings, // Function to refresh the meetup pings.
    respondToPing, // Function to respond to a meetup ping (accept/decline).
    cancelPing, // Function to cancel a sent meetup ping.
  } = useMeetupPings();
  const { colors } = useTheme();

  // Function to render the content based on the loading and data states.
  const renderContent = () => {
    if (isLoading && !pings.length) {
      // Display skeleton loading indicators when data is loading and there are no pings yet.
      return (
        <Stagger>
          {[...Array(3)].map((_, index) => (
            <MeetupPingSkeleton key={index} />
          ))}
        </Stagger>
      );
    }

    // Render the FlatList with meetup pings.
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
          // Add a RefreshControl for pull-to-refresh functionality.
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshPings}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        contentContainerStyle={styles.listContent}
        // Display a message when there are no meetup requests.
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
    // Wrap the screen with ScreenErrorBoundary to handle potential errors.
    <ScreenErrorBoundary onReset={refreshPings}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {renderContent()}
      </SafeAreaView>
    </ScreenErrorBoundary>
  );
};

// StyleSheet for the MeetupListScreen component.
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

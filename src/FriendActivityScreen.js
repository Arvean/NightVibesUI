import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Clock, MapPin } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { ScreenErrorBoundary } from './components/ErrorBoundary';
import { ActivitySkeleton } from './components/Skeleton';
import { Stagger, SlideIn, Scale } from './components/Animated';
import useFriendActivity from './hooks/useFriendActivity';
import { format } from 'date-fns';

const ActivityItem = ({ activity, onLike, onComment }) => {
  const { colors } = useTheme();
  const [showComments, setShowComments] = React.useState(false);
  const [comment, setComment] = React.useState('');

  const renderActivityContent = () => {
    switch (activity.type) {
      case 'check_in':
        return (
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: colors.text }]}>
              <Text style={[styles.username, { color: colors.primary }]}>
                {activity.user.username}
              </Text>{' '}
              checked in at{' '}
              <Text style={[styles.venueName, { color: colors.primary }]}>
                {activity.venue.name}
              </Text>
            </Text>
            <View style={styles.venueInfo}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.venueAddress, { color: colors.textSecondary }]}>
                {activity.venue.address}
              </Text>
            </View>
            {activity.message && (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {activity.message}
              </Text>
            )}
          </View>
        );
      case 'friend_meetup':
        return (
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: colors.text }]}>
              <Text style={[styles.username, { color: colors.primary }]}>
                {activity.user.username}
              </Text>{' '}
              is meeting{' '}
              <Text style={[styles.username, { color: colors.primary }]}>
                {activity.friend.username}
              </Text>{' '}
              at{' '}
              <Text style={[styles.venueName, { color: colors.primary }]}>
                {activity.venue.name}
              </Text>
            </Text>
            <View style={styles.venueInfo}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.venueAddress, { color: colors.textSecondary }]}>
                {activity.venue.address}
              </Text>
            </View>
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
          styles.activityItem,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.activityHeader}>
          <View style={styles.userInfo}>
            {activity.user.profile_picture ? (
              <Image
                source={{ uri: activity.user.profile_picture }}
                style={styles.profilePicture}
              />
            ) : (
              <View
                style={[
                  styles.profilePicture,
                  styles.profilePlaceholder,
                  { backgroundColor: colors.surfaceHighlight },
                ]}
              />
            )}
            <View>
              <Text style={[styles.username, { color: colors.text }]}>
                {activity.user.username}
              </Text>
              <View style={styles.timestamp}>
                <Clock size={12} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {renderActivityContent()}

        <View
          style={[
            styles.activityFooter,
            { borderTopColor: colors.border },
          ]}
        >
          <Button
            variant="ghost"
            onPress={() => onLike(activity.id)}
            style={[
              styles.actionButton,
              activity.has_liked && {
                backgroundColor: colors.surfaceHighlight,
              },
            ]}
          >
            <Heart
              size={20}
              color={activity.has_liked ? colors.error : colors.textSecondary}
              fill={activity.has_liked ? colors.error : 'none'}
            />
            <Text
              style={[
                styles.actionText,
                { color: colors.textSecondary },
              ]}
            >
              {activity.likes_count}
            </Text>
          </Button>

          <Button
            variant="ghost"
            onPress={() => setShowComments(!showComments)}
            style={styles.actionButton}
          >
            <MessageCircle size={20} color={colors.textSecondary} />
            <Text
              style={[
                styles.actionText,
                { color: colors.textSecondary },
              ]}
            >
              {activity.comments_count}
            </Text>
          </Button>
        </View>

        {showComments && (
          <View
            style={[
              styles.commentsSection,
              { borderTopColor: colors.border },
            ]}
          >
            <Stagger>
              {activity.latest_comments.map((comment, index) => (
                <SlideIn key={index} from="right" delay={index * 100}>
                  <View style={styles.comment}>
                    <Text
                      style={[
                        styles.commentUsername,
                        { color: colors.text },
                      ]}
                    >
                      {comment.user.username}
                    </Text>
                    <Text
                      style={[
                        styles.commentText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {comment.content}
                    </Text>
                  </View>
                </SlideIn>
              ))}
            </Stagger>
            <View style={styles.commentInput}>
              <TextInput
                placeholder="Add a comment..."
                value={comment}
                onChangeText={setComment}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholderTextColor={colors.textSecondary}
              />
              <Button
                title="Post"
                onPress={() => {
                  onComment(activity.id, comment);
                  setComment('');
                }}
                disabled={!comment.trim()}
              />
            </View>
          </View>
        )}
      </View>
    </Scale>
  );
};

const FriendActivityScreen = () => {
  const {
    activities,
    isLoading,
    error,
    refreshActivities,
    likeActivity,
    commentOnActivity,
  } = useFriendActivity();
  const { colors } = useTheme();

  const renderContent = () => {
    if (isLoading && !activities.length) {
      return (
        <Stagger>
          {[...Array(3)].map((_, index) => (
            <ActivitySkeleton key={index} />
          ))}
        </Stagger>
      );
    }

    return (
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            onLike={likeActivity}
            onComment={commentOnActivity}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshActivities}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No activities yet
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <ScreenErrorBoundary onReset={refreshActivities}>
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
  activityItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profilePlaceholder: {
    backgroundColor: '#e5e7eb',
  },
  username: {
    fontWeight: '600',
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  activityContent: {
    marginBottom: 12,
  },
  activityText: {
    fontSize: 16,
    lineHeight: 24,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  venueAddress: {
    fontSize: 14,
    marginLeft: 4,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
  },
  activityFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  comment: {
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: '500',
    marginBottom: 2,
  },
  commentInput: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default FriendActivityScreen;

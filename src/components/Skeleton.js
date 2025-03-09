import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * SkeletonItem Component:
 * A reusable component for creating skeleton loading placeholders.
 * @param {object} props - The component's props.
 * @param {number|string} props.width - The width of the skeleton item.
 * @param {number|string} props.height - The height of the skeleton item.
 * @param {object} [props.style] - Additional styles to apply to the skeleton item.
 */
export const SkeletonItem = ({ width, height, style }) => {
  const { colors } = useTheme();
  // Create an animated value for controlling the opacity.
  const animatedValue = useRef(new Animated.Value(0)).current;

  // useEffect hook to create a looping animation.
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolate the animated value to create an opacity animation.
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7], // Adjust opacity values for desired effect
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: colors.skeletonBase, // Use dynamic color from theme
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * ActivitySkeleton Component:
 * A skeleton loading placeholder for an activity item.
 */
export const ActivitySkeleton = () => {
  return (
    <View style={styles.activityContainer}>
      <View style={styles.header}>
        <SkeletonItem width={40} height={40} style={styles.avatar} />
        <View style={styles.headerText}>
          <SkeletonItem width={120} height={16} style={styles.username} />
          <SkeletonItem width={80} height={12} style={styles.timestamp} />
        </View>
      </View>
      <SkeletonItem width="100%" height={60} style={styles.content} />
      <View style={styles.footer}>
        <SkeletonItem width={60} height={24} style={styles.action} />
        <SkeletonItem width={60} height={24} style={styles.action} />
      </View>
    </View>
  );
};

/**
 * VenueSkeleton Component:
 * A skeleton loading placeholder for a venue card.
 */
export const VenueSkeleton = () => {
  return (
    <View style={styles.venueContainer}>
      <View style={styles.venueHeader}>
        <SkeletonItem width={150} height={20} style={styles.venueName} />
        <SkeletonItem width={80} height={24} style={styles.rating} />
      </View>
      <View style={styles.venueInfo}>
        <SkeletonItem width="100%" height={16} style={styles.address} />
        <SkeletonItem width={100} height={16} style={styles.category} />
      </View>
      <View style={styles.stats}>
        <SkeletonItem width={80} height={40} style={styles.stat} />
        <SkeletonItem width={80} height={40} style={styles.stat} />
        <SkeletonItem width={80} height={40} style={styles.stat} />
      </View>
    </View>
  );
};

/**
 * MeetupPingSkeleton Component:
 * A skeleton loading placeholder for a meetup ping item.
 */
export const MeetupPingSkeleton = () => {
  return (
    <View style={styles.pingContainer}>
      <View style={styles.pingHeader}>
        <SkeletonItem width={120} height={16} style={styles.username} />
        <SkeletonItem width={80} height={24} style={styles.status} />
      </View>
      <SkeletonItem width="100%" height={40} style={styles.venueInfo} />
      <View style={styles.pingActions}>
        <SkeletonItem width={100} height={36} style={styles.action} />
        <SkeletonItem width={100} height={36} style={styles.action} />
      </View>
    </View>
  );
};

// StyleSheet for the skeleton components.
const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4, // Rounded corners for the skeleton items
  },
  activityContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    borderRadius: 20, // Circular avatar
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    marginBottom: 4,
  },
  content: {
    marginBottom: 12,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  venueContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueInfo: {
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pingContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  pingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
});

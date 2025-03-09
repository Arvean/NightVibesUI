import { useState, useEffect, useCallback } from 'react';
import api from '../axiosInstance';

/**
 * Custom hook for fetching and managing friend activity data.
 * This hook handles fetching friend activities, polling for updates,
 * liking activities, and commenting on activities.
 * @returns {object} An object containing the activities, loading state, error state,
 *                    and functions for refreshing, liking, and commenting.
 */
export default function useFriendActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback ensures that fetchActivities doesn't change unless its dependencies change
  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/friends/activity/');
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load friend activities');
      console.error('Error fetching friend activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  /**
   * Likes an activity.
   * @param {string} activityId - The ID of the activity to like.
   */
  const likeActivity = async (activityId) => {
    try {
      await api.post(`/api/friends/activity/${activityId}/like/`);
      // Update local state to reflect the like without refetching
      setActivities(current =>
        current.map(activity =>
          activity.id === activityId
            ? { ...activity, likes_count: activity.likes_count + 1, has_liked: true }
            : activity
        )
      );
    } catch (err) {
      console.error('Error liking activity:', err);
    }
  };

  /**
   * Comments on an activity.
   * @param {string} activityId - The ID of the activity to comment on.
   * @param {string} comment - The comment content.
   * @returns {Promise<object>} The new comment data.
   * @throws {Error} If the comment could not be posted.
   */
  const commentOnActivity = async (activityId, comment) => {
    try {
      const response = await api.post(`/api/friends/activity/${activityId}/comment/`, {
        content: comment,
      });
      // Update local state to include the new comment without refetching
      setActivities(current =>
        current.map(activity =>
          activity.id === activityId
            ? {
                ...activity,
                comments_count: activity.comments_count + 1,
                latest_comments: [...activity.latest_comments, response.data],
              }
            : activity
        )
      );
      return response.data;
    } catch (err) {
      console.error('Error commenting on activity:', err);
      throw err;
    }
  };

  return {
    activities, // The list of friend activities.
    isLoading, // Boolean indicating if the activities are being loaded.
    error, // Error message, if any.
    refreshActivities: fetchActivities, // Function to manually refresh activities.
    likeActivity, // Function to like an activity.
    commentOnActivity, // Function to comment on an activity.
  };
}

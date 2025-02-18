import { useState, useEffect, useCallback } from 'react';
import api from '../axiosInstance';

export default function useFriendActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const likeActivity = async (activityId) => {
    try {
      await api.post(`/api/friends/activity/${activityId}/like/`);
      // Update local state
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

  const commentOnActivity = async (activityId, comment) => {
    try {
      const response = await api.post(`/api/friends/activity/${activityId}/comment/`, {
        content: comment,
      });
      // Update local state
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
    activities,
    isLoading,
    error,
    refreshActivities: fetchActivities,
    likeActivity,
    commentOnActivity,
  };
}

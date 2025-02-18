import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

export const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friend_request',
  MEETUP_PING: 'meetup_ping',
  VENUE_UPDATE: 'venue_update',
  CHECK_IN: 'check_in',
  FRIEND_NEARBY: 'friend_nearby'
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/api/notifications/');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.post(`/api/notifications/${notificationId}/read/`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.post('/api/notifications/mark-all-read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}/`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (!notifications.find(n => n.id === notificationId)?.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const clearAll = async () => {
    try {
      await axiosInstance.delete('/api/notifications/clear-all/');
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      await axiosInstance.put('/api/notifications/preferences/', preferences);
      return true;
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      return false;
    }
  };

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences
  };
};

export default useNotifications;

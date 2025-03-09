import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Constants for different notification types.
 * These are used to identify the type of notification and handle them accordingly.
 */
export const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friend_request',
  MEETUP_PING: 'meetup_ping',
  VENUE_UPDATE: 'venue_update',
  CHECK_IN: 'check_in',
  FRIEND_NEARBY: 'friend_nearby'
};

/**
 * Custom hook for managing user notifications.
 * This hook provides functionality for fetching, marking as read, deleting,
 * clearing, and updating notification preferences.
 * @returns {object} An object containing notifications, loading state, error state,
 *                    unread count, and functions for managing notifications.
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]); // State for the list of notifications
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const [unreadCount, setUnreadCount] = useState(0); // State for the number of unread notifications

  // useCallback ensures that fetchNotifications doesn't change unless its dependencies change
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/api/notifications/');
      setNotifications(res.data);
      // Count the number of unread notifications
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Marks a specific notification as read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   */
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.post(`/api/notifications/${notificationId}/read/`);
      // Update local state to mark the notification as read
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      // Decrement the unread count, ensuring it doesn't go below 0
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  /**
   * Marks all notifications as read.
   */
  const markAllAsRead = async () => {
    try {
      await axiosInstance.post('/api/notifications/mark-all-read/');
      // Update local state to mark all notifications as read
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0); // Reset unread count to 0
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  /**
   * Deletes a specific notification.
   * @param {string} notificationId - The ID of the notification to delete.
   */
  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}/`);
      // Update local state to remove the deleted notification
      setNotifications(notifications.filter(n => n.id !== notificationId));
      // Decrement unread count if the deleted notification was unread
      if (!notifications.find(n => n.id === notificationId)?.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  /**
   * Clears all notifications.
   */
  const clearAll = async () => {
    try {
      await axiosInstance.delete('/api/notifications/clear-all/');
      // Update local state to remove all notifications
      setNotifications([]);
      setUnreadCount(0); // Reset unread count to 0
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  /**
   * Updates the user's notification preferences.
   * @param {object} preferences - The new notification preferences.
   * @returns {Promise<boolean>} True if the preferences were updated successfully, false otherwise.
   */
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
    notifications, // The list of notifications.
    isLoading, // Boolean indicating if notifications are being loaded.
    error, // Error message, if any.
    unreadCount, // The number of unread notifications.
    fetchNotifications, // Function to fetch notifications.
    markAsRead, // Function to mark a notification as read.
    markAllAsRead, // Function to mark all notifications as read.
    deleteNotification, // Function to delete a notification.
    clearAll, // Function to clear all notifications.
    updatePreferences // Function to update notification preferences.
  };
};

export default useNotifications;

import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Custom hook for managing a user's friends.
 * This hook provides functionality for fetching, removing, and searching friends.
 * @returns {object} An object containing the friends list, loading state, error state,
 *                    search query, and functions for fetching, removing, sending friend requests and searching.
 */
const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // useCallback ensures that fetchFriends doesn't change unless its dependencies change
  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/api/friends/');
      setFriends(res.data);
    } catch (err) {
      setError('Failed to load friends. Please try again.');
      console.error('Error fetching friends:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Removes a friend from the user's friend list.
   * @param {string} friendId - The ID of the friend to remove.
   * @returns {Promise<boolean>} True if the friend was removed successfully, false otherwise.
   */
  const removeFriend = async (friendId) => {
    try {
      await axiosInstance.delete(`/api/friends/${friendId}/`);
      // Update local state to remove the friend
      setFriends(friends.filter(friend => friend.id !== friendId));
      return true;
    } catch (err) {
      console.error('Error removing friend:', err);
      return false;
    }
  };

    /**
   * Sends a friend request to another user.
   * @param {string} username The username of the user to send a request to.
   * @returns {Promise<boolean>} True if sending succeeded, false if not.
   */
    const sendFriendRequest = async (username) => {
        try {
            await axiosInstance.post('/api/friend-requests/', { username });
            return true;
        }
        catch (err) {
            console.error('Error sending friend request:', err);
            return false;
        }
    };

  /**
   * Sets the search query for filtering friends.
   * @param {string} query - The search query.
   */
  const searchFriends = (query) => {
    setSearchQuery(query);
  };

  // Filter friends based on the search query.
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) // Optional chaining for name
  );

  return {
    friends: filteredFriends, // The list of friends, filtered by the search query.
    isLoading, // Boolean indicating if the friends are being loaded.
    error, // Error message, if any.
    searchQuery, // The current search query.
    fetchFriends, // Function to fetch the user's friends.
    removeFriend, // Function to remove a friend.
    sendFriendRequest, // Function to send a friend request.
    searchFriends // Function to set the search query.
  };
};

export default useFriends;

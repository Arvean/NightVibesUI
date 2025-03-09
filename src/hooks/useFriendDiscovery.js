import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Custom hook for discovering and connecting with friends.
 * This hook provides functionality for fetching friend suggestions,
 * searching for users, and sending friend requests.
 * @returns {object} An object containing friend suggestions, discovered users,
 *                    loading state, error state, search query, and functions
 *                    for fetching suggestions, searching users, sending friend
 *                    requests, and refreshing suggestions.
 */
const useFriendDiscovery = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // useCallback ensures that fetchSuggestions doesn't change unless its dependencies change.
  const fetchSuggestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/api/friends/suggestions/');
      setSuggestions(res.data);
    } catch (err) {
      setError('Failed to load friend suggestions');
      console.error('Error fetching suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Searches for users based on a query string.
   * @param {string} query - The search query.
   */
  const searchUsers = async (query) => {
    try {
      setSearchQuery(query);
      // If the query is empty, clear the discovered users.
      if (!query.trim()) {
        setDiscoveredUsers([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const res = await axiosInstance.get(`/api/users/search/?q=${query}`);
      setDiscoveredUsers(res.data);
    } catch (err) {
      setError('Failed to search users');
      console.error('Error searching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sends a friend request to a user.
   * @param {string} userId - The ID of the user to send a request to.
   * @returns {Promise<boolean>} - True if the request was sent successfully, false otherwise.
   */
  const sendFriendRequest = async (userId) => {
    try {
      await axiosInstance.post('/api/friend-requests/', { user_id: userId });
      // Update suggestions and discovered users to reflect the sent request (optimistic update)
      setSuggestions(suggestions.map(user => 
        user.id === userId ? { ...user, request_sent: true } : user
      ));
      setDiscoveredUsers(users => 
        users.map(user => 
          user.id === userId ? { ...user, request_sent: true } : user
        )
      );
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      return false;
    }
  };

  /**
   * Refreshes the friend suggestions.
   * @returns {Promise<boolean>} True if refresh is successful, false if not.
   */
  const refreshSuggestions = async () => {
    try {
      const res = await axiosInstance.post('/api/friends/refresh-suggestions/');
      setSuggestions(res.data);
      return true;
    } catch (err) {
      console.error('Error refreshing suggestions:', err);
      return false;
    }
  };

  return {
    suggestions, // The list of friend suggestions.
    discoveredUsers, // The list of users discovered through search.
    isLoading, // Boolean indicating if data is currently being loaded.
    error, // Error message, if any.
    searchQuery, // The current search query.
    fetchSuggestions, // Function to fetch friend suggestions.
    searchUsers, // Function to search for users.
    sendFriendRequest, // Function to send a friend request.
    refreshSuggestions // Function to refresh friend suggestions.
  };
};

export default useFriendDiscovery;

import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useFriendDiscovery = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const searchUsers = async (query) => {
    try {
      setSearchQuery(query);
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

  const sendFriendRequest = async (userId) => {
    try {
      await axiosInstance.post('/api/friend-requests/', { user_id: userId });
      // Update suggestions and discovered users to reflect the sent request
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
    suggestions,
    discoveredUsers,
    isLoading,
    error,
    searchQuery,
    fetchSuggestions,
    searchUsers,
    sendFriendRequest,
    refreshSuggestions
  };
};

export default useFriendDiscovery;

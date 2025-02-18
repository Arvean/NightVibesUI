import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const removeFriend = async (friendId) => {
    try {
      await axiosInstance.delete(`/api/friends/${friendId}/`);
      setFriends(friends.filter(friend => friend.id !== friendId));
      return true;
    } catch (err) {
      console.error('Error removing friend:', err);
      return false;
    }
  };

  const sendFriendRequest = async (username) => {
    try {
      await axiosInstance.post('/api/friend-requests/', { username });
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      return false;
    }
  };

  const searchFriends = (query) => {
    setSearchQuery(query);
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    friends: filteredFriends,
    isLoading,
    error,
    searchQuery,
    fetchFriends,
    removeFriend,
    sendFriendRequest,
    searchFriends
  };
};

export default useFriends;

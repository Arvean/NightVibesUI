import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useFriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/api/friend-requests/list/');
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load friend requests. Please try again.');
      console.error('Error fetching friend requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/api/friend-requests/${requestId}/accept/`);
      setRequests(requests.filter(request => request.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      return false;
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/api/friend-requests/${requestId}/decline/`);
      setRequests(requests.filter(request => request.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error declining friend request:', err);
      return false;
    }
  };

  const sendRequest = async (username) => {
    try {
      await axiosInstance.post('/api/friend-requests/', { username });
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      return false;
    }
  };

  return {
    requests,
    isLoading,
    error,
    fetchRequests,
    acceptRequest,
    declineRequest,
    sendRequest
  };
};

export default useFriendRequests;

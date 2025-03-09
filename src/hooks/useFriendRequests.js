import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Custom hook for managing friend requests.
 * This hook provides functionality for fetching, accepting, declining, and sending friend requests.
 * @returns {object} An object containing the friend requests, loading state, error state,
 *                    and functions for fetching, accepting, declining, and sending requests.
 */
const useFriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback ensures that fetchRequests doesn't change unless its dependencies change
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

  /**
   * Accepts a friend request.
   * @param {string} requestId - The ID of the friend request to accept.
   * @returns {Promise<boolean>} True if the request was accepted successfully, false otherwise.
   */
  const acceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/api/friend-requests/${requestId}/accept/`);
      // Update local state to remove the accepted request
      setRequests(requests.filter(request => request.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      return false;
    }
  };

  /**
   * Declines a friend request.
   * @param {string} requestId - The ID of the friend request to decline.
   * @returns {Promise<boolean>} True if the request was declined successfully, false otherwise.
   */
  const declineRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/api/friend-requests/${requestId}/decline/`);
      // Update local state to remove the declined request
      setRequests(requests.filter(request => request.id !== requestId));
      return true;
    } catch (err) {
      console.error('Error declining friend request:', err);
      return false;
    }
  };

    /**
   * Sends a friend request to another user.  This function name is slightly different
   * than the others to reflect that it takes a username, not a request ID.
   * @param {string} username The username of the user to send a request to.
   * @returns {Promise<boolean>} True if sending succeeded, false if not.
   */
    const sendRequest = async (username) => {
        try {
            await axiosInstance.post('/api/friend-requests/', { username });
            return true;
        }
        catch (err) {
            console.error('Error sending friend request:', err);
            return false;
        }
    };

  return {
    requests, // The list of friend requests.
    isLoading, // Boolean indicating if the requests are being loaded.
    error, // Error message, if any.
    fetchRequests, // Function to fetch friend requests.
    acceptRequest, // Function to accept a friend request.
    declineRequest, // Function to decline a friend request.
    sendRequest //Function to send a friend request to a user
  };
};

export default useFriendRequests;

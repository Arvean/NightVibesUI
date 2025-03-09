import { useState, useEffect, useCallback } from 'react';
import api from '../axiosInstance';

/**
 * Custom hook for managing meetup pings.
 * This hook provides functionality for fetching, sending, responding to, and canceling meetup pings.
 * @returns {object} An object containing the meetup pings, loading state, error state,
 *                    and functions for fetching, sending, responding to, and canceling pings.
 */
export default function useMeetupPings() {
  const [pings, setPings] = useState([]); // State for the list of meetup pings
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message

  // useCallback ensures that fetchPings doesn't change unless its dependencies change
  const fetchPings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/meetup-pings/');
      setPings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load meetup pings');
      console.error('Error fetching meetup pings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch when the component using this hook mounts
  useEffect(() => {
    fetchPings();
  }, [fetchPings]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPings, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchPings]);

  /**
   * Sends a meetup ping to another user.
   * @param {string} receiverId - The ID of the user to send the ping to.
   * @param {string} venueId - The ID of the venue for the meetup.
   * @param {string} message - The message to send with the ping.
   * @returns {Promise<object>} The new meetup ping data.
   * @throws {Error} If the ping could not be sent.
   */
  const sendPing = async (receiverId, venueId, message) => {
    try {
      const response = await api.post('/api/meetup-pings/', {
        receiver: receiverId,
        venue: venueId,
        message,
      });
      // Add the new ping to the beginning of the list (optimistic update)
      setPings(current => [response.data, ...current]);
      return response.data;
    } catch (err) {
      console.error('Error sending meetup ping:', err);
      throw err;
    }
  };

  /**
   * Responds to a meetup ping.
   * @param {string} pingId - The ID of the meetup ping to respond to.
   * @param {string} status - The response status ('accepted' or 'declined').
   * @param {string} responseMessage - The response message.
   * @returns {Promise<object>} The updated meetup ping data.
   * @throws {Error} If the response could not be sent.
   */
  const respondToPing = async (pingId, status, responseMessage) => {
    try {
      const response = await api.post(`/api/meetup-pings/${pingId}/${status}/`, {
        message: responseMessage,
      });
      // Update the local state to reflect the response
      setPings(current =>
        current.map(ping =>
          ping.id === pingId ? { ...ping, status, response_message: responseMessage } : ping
        )
      );
      return response.data;
    } catch (err) {
      console.error('Error responding to meetup ping:', err);
      throw err;
    }
  };

  /**
   * Cancels a sent meetup ping.
   * @param {string} pingId - The ID of the meetup ping to cancel.
   * @throws {Error} If the ping could not be canceled.
   */
  const cancelPing = async (pingId) => {
    try {
      await api.delete(`/api/meetup-pings/${pingId}/`);
      // Remove the canceled ping from the local state
      setPings(current => current.filter(ping => ping.id !== pingId));
    } catch (err) {
      console.error('Error canceling meetup ping:', err);
      throw err;
    }
  };

  return {
    pings, // The list of meetup pings.
    isLoading, // Boolean indicating if the pings are being loaded.
    error, // Error message, if any.
    refreshPings: fetchPings, // Function to manually refresh pings.
    sendPing, // Function to send a meetup ping.
    respondToPing, // Function to respond to a meetup ping.
    cancelPing, // Function to cancel a meetup ping.
  };
}

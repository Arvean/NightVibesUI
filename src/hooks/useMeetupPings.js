import { useState, useEffect, useCallback } from 'react';
import api from '../axiosInstance';

export default function useMeetupPings() {
  const [pings, setPings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Initial fetch
  useEffect(() => {
    fetchPings();
  }, [fetchPings]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPings, 30000);
    return () => clearInterval(interval);
  }, [fetchPings]);

  const sendPing = async (receiverId, venueId, message) => {
    try {
      const response = await api.post('/api/meetup-pings/', {
        receiver: receiverId,
        venue: venueId,
        message,
      });
      setPings(current => [response.data, ...current]);
      return response.data;
    } catch (err) {
      console.error('Error sending meetup ping:', err);
      throw err;
    }
  };

  const respondToPing = async (pingId, status, responseMessage) => {
    try {
      const response = await api.post(`/api/meetup-pings/${pingId}/${status}/`, {
        message: responseMessage,
      });
      // Update local state
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

  const cancelPing = async (pingId) => {
    try {
      await api.delete(`/api/meetup-pings/${pingId}/`);
      // Remove from local state
      setPings(current => current.filter(ping => ping.id !== pingId));
    } catch (err) {
      console.error('Error canceling meetup ping:', err);
      throw err;
    }
  };

  return {
    pings,
    isLoading,
    error,
    refreshPings: fetchPings,
    sendPing,
    respondToPing,
    cancelPing,
  };
}

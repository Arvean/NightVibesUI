import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { venuesAPI, friendsAPI } from '../api';

/**
 * Custom hook for managing map data including venues, friends, and viewport
 * @returns {Object} Map data and control functions
 */
const useMapData = () => {
  // Viewport state (latitude, longitude, zoom level)
  const [viewport, setViewport] = useState({
    latitude: 40.7128, // Default latitude (e.g., New York City)
    longitude: -74.0060, // Default longitude (e.g., New York City)
    zoom: 13, // Default zoom level
  });
  const [venues, setVenues] = useState([]); // State for venues
  const [friends, setFriends] = useState([]); // State for friends' locations
  const [selectedItem, setSelectedItem] = useState(null); // State for selected venue/friend on the map
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [sortBy, setSortBy] = useState('distance'); // State for sorting criteria ('distance' or 'popularity')

  // Fetch data based on coordinates
  const fetchData = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      setError('Location coordinates required');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create params object for venue request
      const venueParams = {
        latitude,
        longitude,
        include_vibe: true, // Assuming these are custom parameters for your API
        include_popularity: true
      };

      // Make parallel API requests
      const [venuesRes, friendsRes] = await Promise.all([
        venuesAPI.getAll(venueParams), // Fetch venues with parameters
        friendsAPI.getNearby() // Fetch nearby friends
      ]);

      // Sort venues based on current sort preference
      const sortedVenues = venuesRes.data.sort((a, b) => {
        if (sortBy === 'popularity') {
          return (b.popularity_score || 0) - (a.popularity_score || 0);
        }
        // Default to distance-based sorting (assuming the API returns venues in distance order)
        return 0;
      });

      setVenues(sortedVenues);
      setFriends(friendsRes.data.nearby_friends || []);
      setError(null);
    } catch (err) {
      setError('Failed to load map data. Please try again.');
      console.error('Error fetching map data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's location and initial data
  useEffect(() => {
    const fetchLocationAndData = async () => {
      try {
        // Different geolocation approach based on platform
        if (Platform.OS === 'web') {
          // Web browser geolocation
          const position = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('Geolocation is not supported by your browser'));
              return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true, // Get high accuracy if available
              timeout: 20000, // Timeout after 20 seconds
              maximumAge: 1000, // Accept cached location within 1 second
            });
          });
          
          const { latitude, longitude } = position.coords;
          setViewport(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          
          await fetchData(latitude, longitude);
        } else {
          // React Native - import Geolocation from '@react-native-community/geolocation'
          // or use Expo Location if available
          try {
            const Geolocation = require('@react-native-community/geolocation').default;
            Geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                setViewport(prev => ({
                  ...prev,
                  latitude,
                  longitude
                }));
                await fetchData(latitude, longitude);
              },
              (error) => {
                console.error('Geolocation error:', error);
                setError('Unable to get your location. Please enable location services.');
                setIsLoading(false);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          } catch (e) {
            console.error('Geolocation module error:', e);
            setError('Location services not available.');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Unable to get your location. Please enable location services.');
        setIsLoading(false);
      }
    };

    fetchLocationAndData();
  }, []);

  // Poll for updates
  useEffect(() => {
    if (!viewport.latitude || !viewport.longitude) return;

    const interval = setInterval(() => {
      fetchData(viewport.latitude, viewport.longitude);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [viewport.latitude, viewport.longitude]);

  // Filter venues based on search query
  const filteredVenues = venues.filter(venue =>
    venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (venue.current_vibe && venue.current_vibe.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort venues when sortBy changes
  useEffect(() => {
    const sortedVenues = [...venues].sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.popularity_score || 0) - (a.popularity_score || 0);
      }
      return 0; // Keep original order for distance
    });
    setVenues(sortedVenues);
  }, [sortBy]);

  return {
    viewport, // The current map viewport (latitude, longitude, zoom).
    setViewport, // Function to update the viewport.
    venues: filteredVenues, // The list of venues, filtered by the search query.
    friends, // The list of nearby friends.
    selectedItem, // The currently selected item (venue or friend) on the map.
    setSelectedItem, // Function to set the selected item.
    isLoading, // Boolean indicating if the map data is being loaded.
    error, // Error message, if any.
    searchQuery, // The current search query.
    setSearchQuery, // Function to set the search query.
    sortBy, // The current sorting criteria ('distance' or 'popularity').
    setSortBy, // Function to set the sorting criteria.
    refreshData: () => fetchData(viewport.latitude, viewport.longitude) // Function to manually refresh data.
  };
};

export default useMapData;

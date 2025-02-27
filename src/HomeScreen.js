import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Linking, View, StyleSheet, ActivityIndicator } from 'react-native';
// Importing necessary icons from the 'lucide-react-native' library
import { Activity, MapPin, Users, TrendingUp, Loader } from 'lucide-react-native';
// Importing UI components from the '@/components/ui/' directory
import { Text, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollView } from 'react-native'; // Use ScrollView from react-native
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { AuthContext } from './AuthContext';
import { useTheme } from './context/ThemeContext'; // Import useTheme
import api from './axiosInstance';

/**
 * HomeScreen Component:
 * - Displays trending venues, friend activity, and nearby spots.
 * - Fetches data from various APIs.
 * - Allows users to navigate to venue details or check-in pages.
 */
const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { colors } = useTheme(); // Use the useTheme hook
  // State to store trending venues
  const [trendingVenues, setTrendingVenues] = useState([]);
  // State to store friend activity
  const [friendActivity, setFriendActivity] = useState([]);
  // State to store nearby venues
  const [nearbyVenues, setNearbyVenues] = useState([]);
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // useEffect hook to check for location permissions
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Function to check for location permissions
  const checkLocationPermission = async () => {
    const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (permissionStatus === RESULTS.GRANTED) {
      setLocationPermissionGranted(true);
    } else {
      requestLocationPermission();
    }
  };

  // Function to request location permissions
  const requestLocationPermission = async () => {
    try {
      const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (granted === RESULTS.GRANTED) {
        setLocationPermissionGranted(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in settings to use this feature.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Function to get the current user location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      error => {
        console.log(error);
        Alert.alert("Error", "Failed to get current location.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // useEffect hook to fetch home data when the component mounts
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch trending venues
        const venuesRes = await api.get('/api/venues/?sort_by=popularity');
        // Fetch friend activity - get all checkins and filter
        const activityRes = await api.get('/api/checkins/');

        if (venuesRes.status !== 200 || activityRes.status !== 200) {
          throw new Error('Failed to fetch data');
        }

        const venues = venuesRes.data;
        // Filter friend activity
        const activity = activityRes.data.filter(
          (checkin) =>
            checkin.visibility === 'public' ||
            (user &&
              checkin.user.id !== user.id &&
              checkin.user.friends.includes(user.id))
        );

        let nearby = [];
        if (userLocation) {
          const nearbyRes = await api.get(
            `/api/venues/?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=5000`
          ); // Added a default radius
          if (nearbyRes.status === 200) {
            nearby = nearbyRes.data;
          }
        }

        setTrendingVenues(venues.slice(0, 5));
        setFriendActivity(activity.slice(0, 10));
        setNearbyVenues(nearby.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (locationPermissionGranted) {
      fetchHomeData();
    }
  }, [locationPermissionGranted, userLocation]);

  // Conditional rendering based on loading state
    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        );
      }

      if (error) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
      }

  // Main return statement for rendering the HomeScreen component
  return (
    <View style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <CardHeader style={styles.cardHeader}>
          <CardTitle style={styles.cardTitle}>NightVibes</CardTitle>
        </CardHeader>
      </Card>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Trending Venues */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <View style={styles.iconContainer}>
                  <TrendingUp style={styles.icon} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Trending Tonight</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {trendingVenues.map((venue) => (
                <View
                  key={venue.id}
                  style={styles.venueItem}
                  // Transition to VenueDetailScreen when a venue is clicked
                  onPress={() => navigation.navigate('VenueDetail', { venue })} // Corrected navigation
                  role="button"
                  tabIndex={0}
                >
                  <View style={styles.venueDetails}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueCategory}>{venue.category}</Text>
                  </View>
                  <Badge style={styles.badge} variant="secondary">
                    {venue.current_vibe || 'Lively'}
                  </Badge>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Friend Activity */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <View style={styles.iconContainer}>
                  <Activity style={styles.icon} color={colors.green} />
                  <Text style={styles.sectionTitle}>Friend Activity</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {friendActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Users style={styles.activityIcon} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityUser}>
                        {activity.user.username}
                      </Text>
                      {' checked in at '}
                      <Text style={styles.activityVenue}>{activity.venue.name}</Text>
                    </Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Nearby Venues */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>
                <View style={styles.iconContainer}>
                  <MapPin style={styles.icon} color={colors.red} />
                  <Text style={styles.sectionTitle}>Nearby Spots</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              {nearbyVenues.map((venue) => (
                <View
                  key={venue.id}
                  style={styles.venueItem}
                  // Transition to VenueDetailScreen when a venue is clicked
                  onPress={() => navigation.navigate('VenueDetail', { venue })} // Corrected navigation
                  role="button"
                  tabIndex={0}
                >
                  <View style={styles.venueDetails}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueCategory}>{venue.distance} away</Text>
                    {/* TODO: Calculate actual distance */}
                  </View>
                  {/* Button to trigger the check-in action */}
                  
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );

  async function handleCheckIn(venueId) {
    if (!user) {
      Alert.alert("Error", "You must be logged in to check in.");
      return;
    }
    try {
      const response = await api.post('/api/checkins/', {
        user: user.userId,
        venue: venueId,
        vibe_rating: 'Lively', // Default value
        visibility: 'public', // Default value
      });

      if (response.status === 201) {
        Alert.alert("Success", "Checked in successfully!");
        // Optionally refresh data or update UI
      } else {
        Alert.alert("Error", "Failed to check in. Please try again.");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      Alert.alert("Error", "Failed to check in. Please try again.");
    }
  }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red', // Or use colors.error if available
    },
    headerCard: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    cardHeader: {
        paddingVertical: 16,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    content: {
        paddingBottom: 24,
    },
    card: {
        marginBottom: 24,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    cardContent: {
        paddingTop: 16,
    },
    venueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    venueDetails: {
        flex: 1,
    },
    venueName: {
        fontSize: 16,
        fontWeight: '500',
    },
    venueCategory: {
        fontSize: 14,
        color: 'gray', // Or use colors.textSecondary if available
    },
    badge: {
        marginLeft: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    activityIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'lightgray', // Or use colors.secondary if available
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIcon: {
        width: 16,
        height: 16,
    },
    activityDetails: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
    },
    activityUser: {
        fontWeight: '500',
    },
    activityVenue: {
        fontWeight: '500',
    },
    activityTime: {
        fontSize: 12,
        color: 'gray', // Or use colors.textSecondary if available
    },
    checkInButton: {
      // Add specific styles for your check-in button
    }
});

export default HomeScreen;

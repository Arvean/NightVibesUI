import React, { useState, useEffect, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
// Importing necessary icons from the 'lucide-react-native' library
import {
  MapPin, Users, Star, Clock, Activity,
  ArrowLeft, Loader, MessageSquare, Share2
} from 'lucide-react-native';
// Importing custom components and hooks
import RatingDialog from './components/RatingDialog';
import { useTheme } from './context/ThemeContext';
import axiosInstance from './axiosInstance';

/**
 * VenueDetailScreen Component:
 * - Displays detailed information about a specific venue.
 * - Fetches venue data, current vibe, recent check-ins, and ratings from APIs.
 * - Allows users to submit, update, and delete their ratings for the venue.
 */
const VenueDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { venueId } = route.params;
  const { colors } = useTheme();

  // State variables
  const [venue, setVenue] = useState(null);
  const [currentVibe, setCurrentVibe] = useState(null);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [userRating, setUserRating] = useState(null);  // To track user's existing rating
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(null);

  // useEffect hook to fetch venue data when the component mounts or venueId changes
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [venueRes, vibeRes, checkinsRes, ratingsRes, userRatingRes] = await Promise.all([
          axiosInstance.get(`/api/venues/${venueId}/`),
          axiosInstance.get(`/api/venues/${venueId}/current-vibe/`),
          axiosInstance.get(`/api/venues/${venueId}/checkins/`),
          axiosInstance.get(`/api/venues/${venueId}/ratings/`),
          axiosInstance.get(`/api/ratings/?venue=${venueId}&user=current`)
        ]);

        setVenue(venueRes.data);
        setCurrentVibe(vibeRes.data);
        setRecentCheckins(checkinsRes.data);
        setRatings(ratingsRes.data);
        // Check if the userRatingRes has results and set accordingly
        setUserRating(userRatingRes.data.results ? userRatingRes.data.results[0] : null);
      } catch (err) {
        setError('Failed to load venue details. Please try again.');
        console.error('Error fetching venue data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();

    // Polling for vibe updates every 2 minutes
    const interval = setInterval(async () => {
      try {
        const vibeRes = await axiosInstance.get(`/api/venues/${venueId}/current-vibe/`);
        setCurrentVibe(vibeRes.data);
      } catch (err) {
        console.error('Failed to update vibe:', err);
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [venueId]);

  // Function to handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    setIsSubmitting(true);
    setRatingError(null);
    try {
      let response;
      if (userRating) {
        // Update existing rating
        response = await axiosInstance.put(`/api/ratings/${userRating.id}/`, ratingData);
        console.log("Rating updated:", response.data);
      } else {
        // Submit new rating
        response = await axiosInstance.post('/api/ratings/', { ...ratingData, venue: venueId });
        console.log("Rating submitted:", response.data);
      }
      // Refresh ratings and user rating after submission
      const [ratingsRes, userRatingRes] = await Promise.all([
        axiosInstance.get(`/api/venues/${venueId}/ratings/`),
        axiosInstance.get(`/api/ratings/?venue=${venueId}&user=current`)
      ]);
      setRatings(ratingsRes.data);
      setUserRating(userRatingRes.data.results[0] || null);
      return true;

    } catch (error) {
      console.error("Rating submission error:", error);
      setRatingError('Failed to submit rating. Please try again.');
      return false;

    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle rating deletion
  const handleRatingDelete = async () => {
    if (!userRating) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.delete(`/api/ratings/${userRating.id}/`);
      // Refresh ratings after deletion
      const ratingsRes = await axiosInstance.get(`/api/venues/${venueId}/ratings/`);
      setRatings(ratingsRes.data);
      setUserRating(null); // Reset user rating
    } catch (error) {
      console.error("Rating deletion error:", error);
      setError('Failed to delete rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle check-in action
  const handleCheckIn = () => {
    navigation.navigate('CheckIn', { venueId });
  };

  // Conditional rendering based on loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
      </View>
    );
  }

  // Conditional rendering based on error or venue not found
  if (error || !venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Venue not found'}</Text>
      </View>
    );
  }

  // Main return statement for rendering the VenueDetailScreen component
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerCard, { borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerRow}>
            {/* Button to navigate back to the previous screen */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              testID="back-button"
            >
              <ArrowLeft style={[styles.backIcon, { color: colors.foreground }]} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{venue.name}</Text>
              <View style={styles.cardDescription}>
                <MapPin style={[styles.descriptionIcon, { color: colors.foreground }]} />
                <Text style={{ color: colors.foreground }}>{venue.address}</Text>
              </View>
            </View>
            <View style={styles.shareButton}>
              <Share2 style={[styles.shareIcon, { color: colors.foreground }]} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Current Status Card */}
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.cardContent}>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>Current Vibe</Text>
                  <View style={styles.statusValueContainer}>
                    <Activity style={[styles.statusIcon, { color: colors.primary }]} />
                    <Text style={[styles.statusValue, { color: colors.foreground }]}>
                      {currentVibe?.vibe || 'Unknown'}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusItem}>
                  <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>People Here</Text>
                  <View style={styles.statusValueContainer}>
                    <Users style={[styles.statusIcon, { color: colors.green }]} />
                    <Text style={[styles.statusValue, { color: colors.foreground }]}>
                      {currentVibe?.checkins_count || 0} checked in
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleCheckIn}
            >
              <Text style={{ color: colors.card }}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => navigation.navigate('Map', { venueId })}
            >
              <Text style={{ color: colors.foreground }}>View on Map</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs Content */}
          <View style={styles.tabs}>
            <View style={[styles.tabsList, { borderColor: colors.border }]}>
              <View style={[styles.tabsTrigger, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.foreground }}>Activity</Text>
              </View>
              <View style={[styles.tabsTrigger, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.foreground }}>Ratings</Text>
              </View>
              <View style={[styles.tabsTrigger, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.foreground }}>Details</Text>
              </View>
            </View>
            <View style={styles.tabsContent}>
              {Array.isArray(recentCheckins) && recentCheckins.map((checkin) => (
                <View key={checkin.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.activityItem}>
                      <View>
                        {/* Assuming Avatar component is adapted for React Native */}
                        <View>
                          <Image source={{ uri: checkin.user.profile_picture }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                          <View style={{ position: 'absolute', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{checkin.user.username[0]}</Text>
                          </View>
                        </View>
                        <View style={styles.activityDetails}>
                          <Text style={[styles.activityUser, { color: colors.foreground }]}>
                            {checkin.user.username}
                          </Text>
                          <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>
                            {new Date(checkin.timestamp).toLocaleTimeString()}
                          </Text>
                          {checkin.comment && (
                            <Text style={[styles.activityComment, { color: colors.foreground }]}>{checkin.comment}</Text>
                          )}
                        </View>
                        <View style={{ backgroundColor: colors.secondary, padding: 5, borderRadius: 5 }}>
                          <Text style={{ color: colors.card }}>{checkin.vibe_rating}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.tabsContent}>
              <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <View style={styles.cardContent}>
                  <View style={styles.ratingsContainer}>
                    <View style={styles.overallRating}>
                      <View style={styles.ratingStars}>
                        <Star style={[styles.ratingIcon, { color: 'yellow' }]} />
                        <Text style={[styles.ratingValue, { color: colors.foreground }]}>
                          {ratings?.average_rating?.toFixed(1) || 'N/A'}
                        </Text>
                      </View>
                      <Text style={[styles.ratingsCount, { color: colors.mutedForeground }]}>
                        {ratings?.total_ratings || 0} ratings
                      </Text>
                    </View>

                    {/* Rating Bars */}
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <View key={stars} style={styles.ratingBarRow}>
                        <Text style={[styles.ratingBarLabel, { color: colors.mutedForeground }]}>
                          {stars}★
                        </Text>
                        <View
                          style={[styles.ratingBar, { backgroundColor: colors.border }]}
                        >
                            <View style={{width: `${(ratings?.rating_distribution?.[stars] || 0) / 
                                                (ratings?.total_ratings || 1) * 100}%`, height: 10, backgroundColor: colors.primary}}></View>
                        </View>
                        <Text style={[styles.ratingBarValue, { color: colors.mutedForeground }]}>
                          {ratings?.rating_distribution?.[stars] || 0}
                        </Text>
                      </View>
                    ))}

                    {/* Rate/Edit Button */}
                    <View style={styles.ratingButtonContainer}>
                      {userRating ? (
                        <>
                          <TouchableOpacity
                            testID="edit-rating-button"
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={() => {
                              /* existing code */
                            }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <Text style={{ color: colors.card }}>Edit Your Rating</Text>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            testID="delete-rating-button"
                            style={[styles.deleteButton, { backgroundColor: colors.destructive }]}
                            onPress={handleRatingDelete}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <ActivityIndicator size="small" color="white" />
                            ) : (
                              <Text style={{ color: colors.card }}>Delete</Text>
                            )}
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          testID="rate-venue-button"
                          style={[styles.button, { backgroundColor: colors.primary }]}
                          onPress={() => {
                            /* existing code */
                          }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            <Text style={{ color: colors.card }}>Rate This Venue</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Recent Reviews */}
              {ratings?.recent_reviews?.map((review) => (
                <View key={review.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.reviewItem}>
                      {/* Assuming Avatar component is adapted for React Native */}
                      <View>
                        <Image source={{ uri: review.user.profile_picture }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        <View style={{ position: 'absolute', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                          <Text>{review.user.username[0]}</Text>
                        </View>
                      </View>
                      <View style={styles.reviewDetails}>
                        <View style={styles.reviewHeader}>
                          <Text style={[styles.reviewUser, { color: colors.foreground }]}>
                            {review.user.username}
                          </Text>
                          <View style={styles.reviewRating}>
                            <Star style={[styles.reviewIcon, { color: 'yellow' }]} />
                            <Text style={[styles.reviewRatingValue, { color: colors.foreground }]}>
                              {review.rating}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.reviewTime, { color: colors.mutedForeground }]}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </Text>
                        {review.comment && (
                          <Text style={[styles.reviewComment, { color: colors.foreground }]}>{review.comment}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.tabsContent}>
              <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <View style={styles.cardContent}>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.foreground }]}>Description</Text>
                      <Text style={[styles.detailValue, { color: colors.mutedForeground }]}>
                        {venue.description}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.foreground }]}>Opening Hours</Text>
                      <Text style={[styles.detailValue, { color: colors.mutedForeground }]}>
                        {venue.opening_hours || 'Opening hours not available'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.foreground }]}>Category</Text>
                      <View style={{ backgroundColor: colors.secondary, padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: colors.card }}>{venue.category}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  headerCard: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardHeader: {
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  descriptionIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  shareButton: {
    marginLeft: 12,
  },
  shareIcon: {
    width: 20,
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  tabs: {
    marginBottom: 16,
  },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabsContent: {
    paddingBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityDetails: {
    flex: 1,
    marginLeft: 12,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
  },
  activityComment: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingsContainer: {
    alignItems: 'center',
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingsCount: {
    fontSize: 14,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    width: '100%',
  },
  ratingBarLabel: {
    fontSize: 14,
    width: 24,
  },
  ratingBar: {
      flex: 1,
      marginHorizontal: 8,
      borderRadius: 5
  },
  ratingBarValue: {
    fontSize: 14,
    width: 24,
    textAlign: 'right',
  },
  ratingButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 5
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewDetails: {
    flex: 1,
    marginLeft: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  reviewRatingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewTime: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    marginTop: 4,
  },
  detailsContainer: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
  },
});

export default VenueDetailScreen;

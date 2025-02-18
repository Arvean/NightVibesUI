import React, { useState, useEffect } from 'react';
// Importing necessary icons from the 'lucide-react' library
import { 
  MapPin, Users, Star, Clock, Activity, 
  ArrowLeft, Loader, MessageSquare, Share2 
} from 'lucide-react';
// Importing UI components from the '@/components/ui/' directory
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
// Importing custom components and hooks
import RatingDialog from './components/RatingDialog';
import useVenueRating from './hooks/useVenueRating';
import axiosInstance from './axiosInstance';

/**
 * VenueDetailScreen Component:
 * - Displays detailed information about a specific venue.
 * - Fetches venue data, current vibe, recent check-ins, and ratings from APIs.
 * - Allows users to submit, update, and delete their ratings for the venue.
 */
const VenueDetailScreen = () => {
  // Extract venueId from the URL
  const venueId = window.location.pathname.split('/').pop();
  
  // State variables to store venue data, current vibe, recent check-ins, ratings, and user rating
  const [venue, setVenue] = useState(null);
  const [currentVibe, setCurrentVibe] = useState(null);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom hook for handling venue ratings
  const { 
    submitRating, 
    updateRating, 
    deleteRating,
    isSubmitting,
    error: ratingError,
  } = useVenueRating(venueId);

  // useEffect hook to fetch venue data when the component mounts
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch venue details, current vibe, recent check-ins, ratings, and user rating from APIs
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
        setUserRating(userRatingRes.data.results[0] || null);
      } catch (err) {
        setError('Failed to load venue details. Please try again.');
        console.error('Error fetching venue data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();

    // Poll for vibe updates every 2 minutes
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
    let success;
    
    if (userRating) {
      success = await updateRating(userRating.id, ratingData);
    } else {
      success = await submitRating(ratingData);
    }

    if (success) {
      // Refresh ratings
      const [ratingsRes, userRatingRes] = await Promise.all([
        axiosInstance.get(`/api/venues/${venueId}/ratings/`),
        axiosInstance.get(`/api/ratings/?venue=${venueId}&user=current`)
      ]);
      
      setRatings(ratingsRes.data);
      setUserRating(userRatingRes.data.results[0] || null);
    }

    return success;
  };

  // Function to handle rating deletion
  const handleRatingDelete = async () => {
    if (!userRating) return;

    const success = await deleteRating(userRating.id);
    if (success) {
      // Refresh ratings
      const ratingsRes = await axiosInstance.get(`/api/venues/${venueId}/ratings/`);
      setRatings(ratingsRes.data);
      setUserRating(null);
    }
  };

  // Function to handle check-in action
  const handleCheckIn = () => {
    // Transition to the check-in screen for the current venue
    window.location.href = `/check-in/${venueId}`;
  };

  // Conditional rendering based on loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Conditional rendering based on error or venue not found
  if (error || !venue) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Venue not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main return statement for rendering the VenueDetailScreen component
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="py-4">
          <div className="flex items-center space-x-4">
            {/* Button to navigate back to the previous screen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-xl">{venue.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {venue.address}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto p-4 space-y-6">
          {/* Current Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Current Vibe</p>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">
                      {currentVibe?.vibe || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">People Here</p>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">
                      {currentVibe?.checkins_count || 0} checked in
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Button to trigger the check-in action */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckIn}
            >
              Check In
            </Button>
            {/* Button to view the venue on a map */}
            <Button 
              className="w-full" 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = `/map?venue=${venueId}`}
            >
              View on Map
            </Button>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4 mt-4">
              {recentCheckins.map((checkin) => (
                <Card key={checkin.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={checkin.user.profile_picture} />
                        <AvatarFallback>{checkin.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {checkin.user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(checkin.timestamp).toLocaleTimeString()}
                        </p>
                        {checkin.comment && (
                          <p className="text-sm mt-2">{checkin.comment}</p>
                        )}
                      </div>
                      <Badge variant="secondary">{checkin.vibe_rating}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-2xl font-bold">
                          {ratings?.average_rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {ratings?.total_ratings || 0} ratings
                      </span>
                    </div>
                    
                    {/* Rating Bars */}
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-6">
                          {stars}★
                        </span>
                        <Progress 
                          value={
                            (ratings?.rating_distribution?.[stars] || 0) / 
                            (ratings?.total_ratings || 1) * 100
                          } 
                          className="h-2"
                        />
                        <span className="text-sm text-muted-foreground w-10">
                          {ratings?.rating_distribution?.[stars] || 0}
                        </span>
                      </div>
                    ))}

                    {/* Rate/Edit Button */}
                    <div className="flex justify-center pt-4">
                      {/* RatingDialog component for submitting or editing ratings */}
                      <RatingDialog
                        venueName={venue.name}
                        onSubmit={handleRatingSubmit}
                        isSubmitting={isSubmitting}
                        error={ratingError}
                        initialRating={userRating?.rating}
                        initialComment={userRating?.comment}
                        trigger={
                          <Button variant="outline">
                            {userRating ? 'Edit Your Rating' : 'Rate This Venue'}
                          </Button>
                        }
                      />
                      {userRating && (
                        <Button
                          variant="ghost"
                          className="ml-2"
                          onClick={handleRatingDelete}
                          disabled={isSubmitting}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              {ratings?.recent_reviews?.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.user.profile_picture} />
                        <AvatarFallback>{review.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {review.user.username}
                          </p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                        {review.comment && (
                          <p className="text-sm mt-2">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {venue.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Opening Hours</h3>
                      <div className="text-sm text-muted-foreground">
                        {venue.opening_hours || 'Opening hours not available'}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Category</h3>
                      <Badge variant="outline">{venue.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default VenueDetailScreen;

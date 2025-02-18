import React, { useState, useEffect } from 'react';
// Importing necessary icons from the 'lucide-react' library
import { Activity, MapPin, Users, TrendingUp, Loader } from 'lucide-react';
// Importing UI components from the '@/components/ui/' directory
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

/**
 * HomeScreen Component:
 * - Displays trending venues, friend activity, and nearby spots.
 * - Fetches data from various APIs.
 * - Allows users to navigate to venue details or check-in pages.
 */
const HomeScreen = () => {
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

  // useEffect hook to fetch home data when the component mounts
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch trending venues, friend activity, and nearby venues from APIs
        const [venuesRes, activityRes, nearbyRes] = await Promise.all([
          fetch('/api/venues?sort=trending'),
          fetch('/api/checkins?friends=true'),
          fetch('/api/venues/nearby')
        ]);

        if (!venuesRes.ok || !activityRes.ok || !nearbyRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [venues, activity, nearby] = await Promise.all([
          venuesRes.json(),
          activityRes.json(),
          nearbyRes.json()
        ]);

        setTrendingVenues(venues.slice(0, 5));
        setFriendActivity(activity.slice(0, 10));
        setNearbyVenues(nearby.slice(0, 5));
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Conditional rendering based on loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Conditional rendering based on error state
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main return statement for rendering the HomeScreen component
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="py-4">
          <CardTitle className="text-2xl font-bold">NightVibes</CardTitle>
        </CardHeader>
      </Card>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-6 pb-6">
          {/* Trending Venues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Trending Tonight
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {trendingVenues.map((venue) => (
                <div 
                  key={venue.id}
                  className="flex items-center justify-between"
                  // Transition to VenueDetailScreen when a venue is clicked
                  onClick={() => window.location.href = `/venues/${venue.id}`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{venue.name}</p>
                    <p className="text-sm text-muted-foreground">{venue.category}</p>
                  </div>
                  <Badge variant="secondary">{venue.current_vibe || 'Lively'}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Friend Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Friend Activity
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {friendActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-secondary p-2">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.username}</span>
                      {' checked in at '}
                      <span className="font-medium">{activity.venue.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nearby Venues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Nearby Spots
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {nearbyVenues.map((venue) => (
                <div 
                  key={venue.id}
                  className="flex items-center justify-between"
                  // Transition to VenueDetailScreen when a venue is clicked
                  onClick={() => window.location.href = `/venues/${venue.id}`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{venue.name}</p>
                    <p className="text-sm text-muted-foreground">{venue.distance} away</p>
                  </div>
                  {/* Button to trigger the check-in action */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/check-in/${venue.id}`;
                    }}
                    size="sm"
                  >
                    Check In
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomeScreen;
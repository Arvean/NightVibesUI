import React, { useState, useEffect } from 'react';
import { MapPin, Shield, MessageSquare, ArrowLeft, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const VIBE_OPTIONS = [
  { value: 'Lively', label: 'Lively 🎉', description: 'High energy, busy atmosphere' },
  { value: 'Chill', label: 'Chill 😌', description: 'Relaxed, comfortable vibe' },
  { value: 'Crowded', label: 'Crowded 👥', description: 'Packed but still fun' },
  { value: 'Empty', label: 'Empty 🌙', description: 'Quiet, few people around' }
];

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Everyone can see your check-in' },
  { value: 'friends', label: 'Friends Only', description: 'Only your friends can see' },
  { value: 'private', label: 'Private', description: 'Only visible to you' }
];

const CheckInScreen = () => {
  // Get venue ID from URL (you might want to adjust this based on your routing)
  const venueId = window.location.pathname.split('/').pop();
  
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedVibe, setSelectedVibe] = useState('');
  const [comment, setComment] = useState('');
  const [privacy, setPrivacy] = useState('public');

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) throw new Error('Failed to fetch venue details');
        const data = await response.json();
        setVenue(data);
      } catch (err) {
        setError('Failed to load venue details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const handleSubmit = async () => {
    if (!selectedVibe) {
      setError('Please select a vibe before checking in.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/checkins/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venue: venueId,
          vibe_rating: selectedVibe,
          comment,
          visibility: privacy
        }),
      });

      if (!response.ok) throw new Error('Failed to check in');

      // Redirect back to the venue page on success
      window.location.href = `/venues/${venueId}`;
    } catch (err) {
      setError('Failed to check in. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>Venue not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Card className="rounded-none border-b">
        <CardHeader className="py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl">Check In</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="flex-1">
        <div className="container max-w-2xl mx-auto p-4 space-y-6">
          {/* Venue Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{venue.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {venue.address}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{venue.category}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Vibe Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How's the vibe?</CardTitle>
              <CardDescription>Select the current atmosphere</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedVibe}
                onValueChange={setSelectedVibe}
                className="grid gap-4"
              >
                {VIBE_OPTIONS.map((vibe) => (
                  <Label
                    key={vibe.value}
                    className="flex flex-col space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={vibe.value} id={vibe.value} />
                      <span className="font-medium">{vibe.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground pl-7">
                      {vibe.description}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a comment</CardTitle>
              <CardDescription>Share your experience (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How's your night going?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy Settings</CardTitle>
              <CardDescription>Control who sees your check-in</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={privacy}
                onValueChange={setPrivacy}
                className="grid gap-4"
              >
                {PRIVACY_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    className="flex flex-col space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground pl-7">
                      {option.description}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Checking In...
              </>
            ) : (
              'Check In'
            )}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CheckInScreen;
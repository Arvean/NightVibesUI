import { useState } from 'react';
import axiosInstance from '../axiosInstance';

/**
 * Custom hook for managing venue ratings
 * @param {Object} venue - The venue object
 * @returns {Object} Rating operations and state
 */
const useVenueRating = (venue) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  const openRatingDialog = () => {
    setIsRatingDialogOpen(true);
  };

  const closeRatingDialog = () => {
    setIsRatingDialogOpen(false);
    setError(null);
  };

  /**
   * Submit a new rating for the venue
   * @param {Object} ratingData - Rating data to submit
   * @param {number} ratingData.vibeRating - Vibe rating value (1-5)
   * @param {number} ratingData.crowdLevel - Crowd level rating (1-5)
   */
  const submitRating = async (ratingData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await axiosInstance.post(`/venues/${venue.id}/ratings`, {
        venueId: venue.id,
        vibeRating: ratingData.vibeRating,
        crowdLevel: ratingData.crowdLevel
      });

      setIsRatingDialogOpen(false);
      return true;
    } catch (err) {
      setError('Failed to submit rating');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Update an existing rating
   * @param {string} ratingId - ID of the rating to update
   * @param {Object} ratingData - Updated rating data
   */
  const updateRating = async (ratingId, ratingData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await axiosInstance.put(`/venues/${venue.id}/ratings/${ratingId}`, {
        venueId: venue.id,
        vibeRating: ratingData.vibeRating,
        crowdLevel: ratingData.crowdLevel
      });

      setIsRatingDialogOpen(false);
      return true;
    } catch (err) {
      setError('Failed to update rating');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete a rating
   * @param {string} ratingId - ID of the rating to delete
   */
  const deleteRating = async (ratingId) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await axiosInstance.delete(`/venues/${venue.id}/ratings/${ratingId}`);

      return true;
    } catch (err) {
      setError('Failed to delete rating');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRating,
    updateRating,
    deleteRating,
    isSubmitting,
    error,
    setError,
    isRatingDialogOpen,
    openRatingDialog,
    closeRatingDialog
  };
};

export default useVenueRating;

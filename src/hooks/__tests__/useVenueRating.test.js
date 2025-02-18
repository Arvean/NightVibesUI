import { renderHook, act } from '@testing-library/react';
import useVenueRating from '../useVenueRating';
import axiosInstance from '../../axiosInstance';

jest.mock('../../axiosInstance');

describe('useVenueRating', () => {
  const mockVenue = { id: '1', name: 'Test Venue' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useVenueRating(mockVenue));

    expect(result.current.isRatingDialogOpen).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('opens rating dialog', () => {
    const { result } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    expect(result.current.isRatingDialogOpen).toBe(true);
  });

  it('closes rating dialog', () => {
    const { result } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    act(() => {
      result.current.closeRatingDialog();
    });

    expect(result.current.isRatingDialogOpen).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('submits rating successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    await act(async () => {
      const success = await result.current.submitRating({
        vibeRating: 4,
        crowdLevel: 3
      });
      expect(success).toBe(true);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isRatingDialogOpen).toBe(false);
    expect(axiosInstance.post).toHaveBeenCalledWith('/venues/1/ratings', {
      venueId: '1',
      vibeRating: 4,
      crowdLevel: 3
    });
  });

  it('handles rating submission error', async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error('Failed to submit rating'));
    const { result } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    await act(async () => {
      const success = await result.current.submitRating({
        vibeRating: 4,
        crowdLevel: 3
      });
      expect(success).toBe(false);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('Failed to submit rating');
    expect(result.current.isRatingDialogOpen).toBe(true);
  });

  it('updates rating successfully', async () => {
    axiosInstance.put.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useVenueRating(mockVenue));

    await act(async () => {
      const success = await result.current.updateRating('rating123', {
        vibeRating: 5,
        crowdLevel: 4
      });
      expect(success).toBe(true);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isRatingDialogOpen).toBe(false);
    expect(axiosInstance.put).toHaveBeenCalledWith('/venues/1/ratings/rating123', {
      venueId: '1',
      vibeRating: 5,
      crowdLevel: 4
    });
  });

  it('deletes rating successfully', async () => {
    axiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
    const { result } = renderHook(() => useVenueRating(mockVenue));

    await act(async () => {
      const success = await result.current.deleteRating('rating123');
      expect(success).toBe(true);
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(axiosInstance.delete).toHaveBeenCalledWith('/venues/1/ratings/rating123');
  });
});

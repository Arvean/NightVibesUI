import { renderHook, act } from '@testing-library/react-hooks';
import useVenueRating from '../useVenueRating';
import axiosInstance from '../../axiosInstance';

jest.mock('../../axiosInstance', () => {
  return {
    get: jest.fn(),
    post: jest.fn(() => Promise.resolve({ data: { success: true } })),
    put: jest.fn(() => Promise.resolve({ data: { success: true } })),
    delete: jest.fn(() => Promise.resolve({ data: { success: true } })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  };
});

describe('useVenueRating', () => {
  const mockVenue = { id: '1', name: 'Test Venue' };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configure successful responses for API calls
    axiosInstance.post.mockResolvedValue({ data: { success: true, rating: 4 } });
    axiosInstance.put.mockResolvedValue({ data: { success: true, rating: 5 } });
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });
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
    // Mock a successful response
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
    
    const { result, waitForNextUpdate } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    let success;
    await act(async () => {
      const submitPromise = result.current.submitRating({
        vibeRating: 4,
        crowdLevel: 3
      });
      await waitForNextUpdate();
      success = await submitPromise;
    });

    expect(success).toBe(true);
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
    // Mock an error response
    axiosInstance.post.mockRejectedValueOnce(new Error('API error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useVenueRating(mockVenue));

    act(() => {
      result.current.openRatingDialog();
    });

    let success;
    await act(async () => {
      const submitPromise = result.current.submitRating({
        vibeRating: 4,
        crowdLevel: 3
      });
      await waitForNextUpdate();
      success = await submitPromise;
    });

    expect(success).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('Failed to submit rating');
    expect(result.current.isRatingDialogOpen).toBe(true); // Should remain true on error
  });

  it('updates rating successfully', async () => {
    // Mock a successful response
    axiosInstance.put.mockResolvedValueOnce({ data: { success: true } });
    
    const { result, waitForNextUpdate } = renderHook(() => useVenueRating(mockVenue));

    let success;
    await act(async () => {
      const updatePromise = result.current.updateRating('rating123', {
        vibeRating: 5,
        crowdLevel: 4
      });
      await waitForNextUpdate();
      success = await updatePromise;
    });

    expect(success).toBe(true);
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
    // Mock a successful response
    axiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
    
    const { result, waitForNextUpdate } = renderHook(() => useVenueRating(mockVenue));

    let success;
    await act(async () => {
      const deletePromise = result.current.deleteRating('rating123');
      await waitForNextUpdate();
      success = await deletePromise;
    });
    
    expect(success).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(axiosInstance.delete).toHaveBeenCalledWith('/venues/1/ratings/rating123');
  });
});

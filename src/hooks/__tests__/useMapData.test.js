import { renderHook, act } from '@testing-library/react-hooks';
import useMapData from '../useMapData';
import axiosInstance from '../../axiosInstance';

// Mock axios instance with all methods
jest.mock('../../axiosInstance', () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

describe('useMapData', () => {
  const mockVenues = [
    { 
      id: 1, 
      name: 'Test Venue', 
      category: 'Bar',
      current_vibe: 'Lively',
      popularity_score: 85,
      location: { coordinates: [-74.0060, 40.7128] }
    }
  ];
  
  const mockFriends = {
    nearby_friends: [
      {
        id: 1,
        username: 'testUser',
        location: { coordinates: [-74.0060, 40.7128] }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.0060 } });
    });

    // Mock API responses - ensure these return promises with the expected structure
    axiosInstance.get.mockImplementation((url) => {
      if (url.includes('/api/venues')) {
        return Promise.resolve({ data: mockVenues });
      }
      if (url.includes('/api/friends/nearby')) {
        return Promise.resolve({ data: mockFriends });
      }
      return Promise.reject(new Error('Unknown endpoint')); 
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default values', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMapData());
    
    // Wait for all promises to resolve
    await waitForNextUpdate();
    
    expect(result.current.viewport).toEqual({
      latitude: 40.7128,
      longitude: -74.0060,
      zoom: 13
    });
    expect(result.current.venues).toEqual(mockVenues);
    expect(result.current.friends).toEqual(mockFriends.nearby_friends);
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searchQuery).toBe('');
  });

  test('fetches location and data on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMapData());
    
    await waitForNextUpdate();
    
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/venues/')
    );
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/friends/nearby/')
    );
    expect(result.current.venues).toEqual(mockVenues);
    expect(result.current.friends).toEqual(mockFriends.nearby_friends);
    expect(result.current.isLoading).toBe(false);
  });

  test('handles geolocation error', async () => {
    // Mock geolocation error with the correct error structure
    // The error callback expects an object with a code and message property
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) =>
      error({
        code: 1, // PERMISSION_DENIED
        message: 'Geolocation error'
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useMapData());

    await waitForNextUpdate();

    expect(result.current.error).toBe(
      'Unable to get your location. Please enable location services.'
    );
    expect(result.current.isLoading).toBe(false);
  });

  test('handles API error', async () => {
      // Mock API error
      axiosInstance.get.mockRejectedValueOnce(new Error('API error'));
      const { result, waitForNextUpdate } = renderHook(() => useMapData());

      await waitForNextUpdate();
      expect(result.current.error).toBe('Failed to load map data. Please try again.');
      expect(result.current.isLoading).toBe(false);
  });

  test('filters venues based on search query', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMapData());

    await waitForNextUpdate();
    
    act(() => {
      result.current.setSearchQuery('bar');
    });
    
    expect(result.current.venues).toEqual(mockVenues);
    
    act(() => {
      result.current.setSearchQuery('invalid');
    });
    
    expect(result.current.venues).toEqual([]);
  });

  test('updates data periodically', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMapData());

    // Wait for initial fetch
    await waitForNextUpdate();
    
    // Clear previous API calls to check for new ones
    axiosInstance.get.mockClear();
    
    // Fast-forward time to trigger the interval
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    // Wait for the async function to complete after the timer
    // This ensures we don't check assertions before the mock is called
    await Promise.resolve();
    await Promise.resolve();
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/venues/')
    );
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/friends/nearby/')
    );
  });

  test('cleans up interval on unmount', async () => {
    const { unmount } = renderHook(() => useMapData());
    
    // Wait for initial fetch to complete
    await Promise.resolve();
    
    // Clear previous API calls 
    axiosInstance.get.mockClear();
    
    // Unmount the component
    unmount();
    
    // Advance time
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    // Give time for any potential async operations
    await Promise.resolve();
    
    // Verify no calls were made after unmounting
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });
});

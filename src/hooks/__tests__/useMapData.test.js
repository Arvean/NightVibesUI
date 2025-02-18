import { renderHook, act } from '@testing-library/react-hooks';
import useMapData from '../useMapData';
import axiosInstance from '../../axiosInstance';

// Mock axios instance
jest.mock('../../axiosInstance');

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

describe('useMapData', () => {
  const mockVenues = [
    { 
      id: 1, 
      name: 'Test Venue', 
      category: 'Bar',
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
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success({ coords: { latitude: 40.7128, longitude: -74.0060 } })
    );

    // Mock successful API responses
    axiosInstance.get.mockImplementation((url) => {
      if (url.includes('/api/venues')) {
        return Promise.resolve({ data: mockVenues });
      }
      if (url.includes('/api/friends/nearby')) {
        return Promise.resolve({ data: mockFriends });
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useMapData());
    
    expect(result.current.viewport).toEqual({
      latitude: 40.7128,
      longitude: -74.0060,
      zoom: 13
    });
    expect(result.current.venues).toEqual([]);
    expect(result.current.friends).toEqual([]);
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.isLoading).toBe(true);
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
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) =>
      error(new Error('Geolocation error'))
    );

    const { result, waitForNextUpdate } = renderHook(() => useMapData());
    
    await waitForNextUpdate();
    
    expect(result.current.error).toBe(
      'Unable to get your location. Please enable location services.'
    );
    expect(result.current.isLoading).toBe(false);
  });

  test('handles API error', async () => {
    axiosInstance.get.mockRejectedValue(new Error('API error'));

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
    const { waitForNextUpdate } = renderHook(() => useMapData());
    
    await waitForNextUpdate();
    
    axiosInstance.get.mockClear();
    
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/venues/')
    );
    expect(axiosInstance.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/friends/nearby/')
    );
  });

  test('cleans up interval on unmount', async () => {
    const { unmount, waitForNextUpdate } = renderHook(() => useMapData());
    
    await waitForNextUpdate();
    
    axiosInstance.get.mockClear();
    
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });
});

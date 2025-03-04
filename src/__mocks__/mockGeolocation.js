// Mock for browser's Geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((successCallback) => {
    successCallback({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
  }),
  watchPosition: jest.fn().mockImplementation((successCallback) => {
    successCallback({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
    return 123; // Mock watchId
  }),
  clearWatch: jest.fn(),
};

export default mockGeolocation; 
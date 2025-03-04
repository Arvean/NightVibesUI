/**
 * Mock for react-native-permissions
 */

const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
  LIMITED: 'limited',
};

const PERMISSIONS = {
  ANDROID: {
    ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
    ACCESS_BACKGROUND_LOCATION: 'android.permission.ACCESS_BACKGROUND_LOCATION',
    // Add other Android permissions as needed
  },
  IOS: {
    LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
    LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS',
    // Add other iOS permissions as needed
  },
};

const ReactNativePermissions = {
  RESULTS,
  PERMISSIONS,
  check: jest.fn().mockResolvedValue(RESULTS.GRANTED),
  request: jest.fn().mockResolvedValue(RESULTS.GRANTED),
  checkMultiple: jest.fn().mockResolvedValue({
    [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: RESULTS.GRANTED,
    [PERMISSIONS.IOS.LOCATION_ALWAYS]: RESULTS.GRANTED,
  }),
  requestMultiple: jest.fn().mockResolvedValue({
    [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: RESULTS.GRANTED,
    [PERMISSIONS.IOS.LOCATION_ALWAYS]: RESULTS.GRANTED,
  }),
  openSettings: jest.fn().mockResolvedValue(true),
  checkNotifications: jest.fn().mockResolvedValue({
    status: RESULTS.GRANTED,
    settings: {},
  }),
  requestNotifications: jest.fn().mockResolvedValue({
    status: RESULTS.GRANTED,
    settings: {},
  }),
};

export default ReactNativePermissions; 
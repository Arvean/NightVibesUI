// Define __DEV__ for testing environment
global.__DEV__ = true;

// Mock for useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'),
}));

// Alternative mock for direct react-native imports
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  
  // Create a proper mock for useColorScheme
  Object.defineProperty(reactNative, 'useColorScheme', {
    value: jest.fn(() => 'light'),
    configurable: true,
  });
  
  return reactNative;
});
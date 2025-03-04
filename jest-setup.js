// Define __DEV__ globally to fix the React Native testing issue
global.__DEV__ = true;

// Make sure this runs before any other setup
jest.mock('react-native', () => {
  // First define __DEV__ in case it's used during the require
  global.__DEV__ = true;
  
  // Then load the actual mock
  const reactNativeMock = require('./src/__mocks__/react-native');
  return reactNativeMock;
}, { virtual: true }); 
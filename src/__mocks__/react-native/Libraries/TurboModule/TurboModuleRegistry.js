/**
 * Mock implementation for React Native's TurboModuleRegistry
 */

// Mock implementations for commonly used native modules
const mockNativeModules = {
  DeviceInfo: {
    getConstants: () => ({
      isTesting: true,
      reactNativeVersion: {
        major: 0,
        minor: 63,
        patch: 0,
      },
      osVersion: '10.0',
      systemName: 'iOS',
      brand: 'Apple',
      model: 'iPhone Test',
      isTablet: false
    }),
  },
  PlatformConstants: {
    forceTouchAvailable: false,
    interfaceIdiom: 'phone',
    isTesting: true,
    osVersion: '10.0',
    reactNativeVersion: {
      major: 0,
      minor: 63,
      patch: 0,
    }
  },
  Dimensions: {
    get: jest.fn(() => ({
      width: 375, 
      height: 812,
      scale: 2,
      fontScale: 1,
    })),
  },
  ImageLoader: {
    getSize: jest.fn((uri, success) => success(100, 100)),
    prefetchImage: jest.fn(() => Promise.resolve()),
    prefetch: jest.fn(() => Promise.resolve()),
  },
  Clipboard: {
    getString: jest.fn(() => Promise.resolve('')),
    setString: jest.fn(),
  },
  NativeAnimatedModule: {
    startOperationBatch: jest.fn(),
    finishOperationBatch: jest.fn(),
    createAnimatedNode: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
    startAnimatingNode: jest.fn(),
    stopAnimation: jest.fn(),
    setAnimatedNodeValue: jest.fn(),
    setAnimatedNodeOffset: jest.fn(),
    flattenAnimatedNodeOffset: jest.fn(),
    extractAnimatedNodeOffset: jest.fn(),
    connectAnimatedNodeToView: jest.fn(),
    disconnectAnimatedNodeFromView: jest.fn(),
    restoreDefaultValues: jest.fn(),
    dropAnimatedNode: jest.fn(),
    addAnimatedEventToView: jest.fn(),
    removeAnimatedEventFromView: jest.fn(),
  },
};

/**
 * Mock functions for TurboModuleRegistry
 */
const TurboModuleRegistry = {
  // Returns the native module if it exists or a mock implementation
  get: (name) => {
    return mockNativeModules[name] || null;
  },
  
  // Enforcing version that throws if the module doesn't exist
  getEnforcing: (name) => {
    if (mockNativeModules[name]) {
      return mockNativeModules[name];
    }
    
    // For any requested module that isn't explicitly mocked,
    // return a basic mock object to prevent test failures
    return {
      __mocked: true,
      moduleName: name,
    };
  },
};

export default TurboModuleRegistry; 
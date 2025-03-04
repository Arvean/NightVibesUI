/**
 * Mock implementation for React Native's NativeModules
 */

const NativeModules = {
  StatusBarManager: {
    HEIGHT: 44,
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
  },
  ImagePickerManager: {
    showImagePicker: jest.fn(),
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn(),
  },
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {
      UNDETERMINED: 0,
      BEGAN: 1,
      ACTIVE: 2,
      CANCELLED: 3,
      FAILED: 4,
      END: 5,
    },
    Direction: {
      RIGHT: 1,
      LEFT: 2,
      UP: 4,
      DOWN: 8,
    },
  },
  UIManager: {
    measure: jest.fn(),
    measureInWindow: jest.fn(),
    measureLayout: jest.fn(),
    dispatchViewManagerCommand: jest.fn(),
    createView: jest.fn(),
    updateView: jest.fn(),
    removeView: jest.fn(),
    findSubviewIn: jest.fn(),
    setJSResponder: jest.fn(),
    clearJSResponder: jest.fn(),
  },
  RNCNetInfo: {
    getCurrentState: jest.fn(() => Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    })),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  RNCAsyncStorage: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
  RNPermissions: {
    check: jest.fn(() => Promise.resolve(true)),
    request: jest.fn(() => Promise.resolve(true)),
  },
  // Add the DeviceInfo module to handle the specific error
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
    getUniqueId: jest.fn(() => 'test-unique-id'),
    getModel: jest.fn(() => 'Test Model'),
    getSystemName: jest.fn(() => 'Test System'),
    getSystemVersion: jest.fn(() => '1.0'),
    getVersion: jest.fn(() => '1.0'),
    getBuildNumber: jest.fn(() => '1'),
    isTablet: jest.fn(() => false),
    isEmulator: jest.fn(() => false),
  },
  // Safe area context related modules
  SafeAreaManager: {
    getSafeAreaInsets: jest.fn(() => ({
      top: 44,
      right: 0,
      bottom: 34,
      left: 0,
    })),
  },
  RNDatePickerManager: {
    openPicker: jest.fn(),
  },
  // Add TurboModuleRegistry to fix "getEnforcing" error
  TurboModuleRegistry: {
    getEnforcing: jest.fn((moduleName) => {
      if (moduleName === 'DeviceInfo') {
        return NativeModules.DeviceInfo;
      }
      if (moduleName === 'RNPermissions') {
        return NativeModules.RNPermissions;
      }
      // Return null for any other module
      return null;
    }),
  },
  // Add any other native modules that might be needed here
};

export default NativeModules; 
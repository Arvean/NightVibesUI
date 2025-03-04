import React from 'react';

// Enable ES modules for Jest
require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

// Mock the DeviceInfo native module to avoid errors
global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: {},
  localModulesConfig: {},
};

// Mock all React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock out the native components that will cause issues in tests
  return {
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      Version: 13,
      isPad: false,
      isTVOS: false,
      select: jest.fn(obj => obj.ios || obj.default),
    },
    NativeModules: {
      ...RN.NativeModules,
      DeviceInfo: {
        Dimensions: { 
          window: { 
            width: 375, 
            height: 812,
            scale: 2,
            fontScale: 1,
          },
          screen: { 
            width: 375, 
            height: 812,
            scale: 2,
            fontScale: 1,
          },
        },
        isTablet: false,
      },
      RNGestureHandlerModule: {
        attachGestureHandler: jest.fn(),
        createGestureHandler: jest.fn(),
        dropGestureHandler: jest.fn(),
        updateGestureHandler: jest.fn(),
        State: {},
        Directions: {},
      },
      StatusBarManager: {
        HEIGHT: 44,
        setStyle: jest.fn(),
        setHidden: jest.fn(),
      },
      RNCAsyncStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        multiGet: jest.fn(),
        multiSet: jest.fn(),
        multiRemove: jest.fn(),
        clear: jest.fn(),
        getAllKeys: jest.fn(),
      },
    },
    Dimensions: {
      get: jest.fn(() => ({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 1,
      })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    StyleSheet: { 
      ...RN.StyleSheet, 
      create: jest.fn(styles => styles),
      flatten: jest.fn(styles => styles),
    },
    Animated: { 
      ...RN.Animated,
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      decay: jest.fn(() => ({ start: jest.fn() })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => ({
          setValue: jest.fn(),
          interpolate: jest.fn(),
        })),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    },
    View: jest.fn(({ children, ...props }) => ({ type: 'View', props, children })),
    Text: jest.fn(({ children, ...props }) => ({ type: 'Text', props, children })),
    TextInput: jest.fn(({ children, ...props }) => ({ type: 'TextInput', props, children })),
    Image: jest.fn(({ children, ...props }) => ({ type: 'Image', props, children })),
    ScrollView: jest.fn(({ children, ...props }) => ({ type: 'ScrollView', props, children })),
    TouchableOpacity: jest.fn(({ children, ...props }) => ({ type: 'TouchableOpacity', props, children })),
    TouchableWithoutFeedback: jest.fn(({ children, ...props }) => ({ type: 'TouchableWithoutFeedback', props, children })),
    ActivityIndicator: jest.fn(({ children, ...props }) => ({ type: 'ActivityIndicator', props, children })),
    FlatList: jest.fn(({ children, ...props }) => ({ type: 'FlatList', props, children })),
  };
});

// Mock for react-native-device-info
jest.mock('react-native-device-info', () => {
  return {
    getVersion: jest.fn().mockReturnValue('1.0'),
    getBuildNumber: jest.fn().mockReturnValue('1'),
    getUniqueId: jest.fn().mockReturnValue('test-unique-id'),
    getModel: jest.fn().mockReturnValue('Test Model'),
    getBrand: jest.fn().mockReturnValue('Test Brand'),
    getSystemVersion: jest.fn().mockReturnValue('14.0'),
    isTablet: jest.fn().mockReturnValue(false),
  };
});

// Mock for AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock for react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(insets)),
    SafeAreaView: jest.fn(({ children, ...props }) => ({ type: 'SafeAreaView', props, children })),
    useSafeAreaInsets: jest.fn(() => insets),
    useSafeAreaFrame: jest.fn(() => ({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    })),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 390, height: 844 },
      insets,
    },
  };
});

// Mock for @react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      dispatch: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
    useIsFocused: jest.fn(() => true),
    createNavigatorFactory: jest.fn(component => component),
    NavigationContainer: jest.fn(({ children }) => children),
  };
});

// Mock for react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: jest.fn(({ children }) => children),
    PanGestureHandler: jest.fn(({ children }) => children),
    TapGestureHandler: jest.fn(({ children }) => children),
    State: {},
    ScrollView: jest.fn(({ children }) => children),
    PureNativeButton: jest.fn(({ children }) => children),
    BaseButton: jest.fn(({ children }) => children),
    RectButton: jest.fn(({ children }) => children),
    BorderlessButton: jest.fn(({ children }) => children),
  };
});

// Mock for expo libraries if they're used
jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 37.78825, longitude: -122.4324 },
  })),
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
}));

// Define __DEV__ variable
global.__DEV__ = true;

// Set up global mocks for fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    ok: true,
  })
);

// Set up global mocks for navigator
global.navigator = {
  ...global.navigator,
  geolocation: {
    getCurrentPosition: jest.fn(success => success({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      }
    })),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
  },
};

// Create simple mocks for the components that might be imported from external files
jest.mock('../src/context/ThemeContext', () => {
  const themeContextValue = {
    theme: 'light',
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      text: '#000000',
    },
    toggleTheme: jest.fn(),
  };
  
  return {
    ThemeContext: {
      Provider: jest.fn(({ children }) => children),
      Consumer: jest.fn(({ children }) => children(themeContextValue)),
    },
    ThemeProvider: jest.fn(({ children }) => children),
    useTheme: jest.fn(() => themeContextValue),
  };
});

jest.mock('../src/AuthContext', () => {
  const authContextValue = {
    user: { id: 'test-user-id', username: 'testuser' },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  };
  
  return {
    AuthContext: {
      Provider: jest.fn(({ children }) => children),
      Consumer: jest.fn(({ children }) => children(authContextValue)),
    },
    AuthProvider: jest.fn(({ children }) => children),
    useAuth: jest.fn(() => authContextValue),
  };
});

// Mock for axios
jest.mock('../src/axiosInstance', () => {
  return {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
  };
}); 
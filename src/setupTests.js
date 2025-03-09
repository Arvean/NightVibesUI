// Jest Setup File
// This file is automatically run by Jest before each test file.
// It's used to set up the testing environment, mock modules, and define global configurations.

// Import Jest globals at the very beginning of the file to ensure they are available
// even if modules like 'react-native' are mocked before the globals are usually available.
if (typeof beforeEach !== 'function') {
  global.beforeEach = function(fn) { if (typeof fn === 'function') fn(); };
}
if (typeof afterEach !== 'function') {
  global.afterEach = function(fn) { if (typeof fn === 'function') fn(); };
}
if (typeof jest !== 'object') {
  global.jest = {
    mock: () => jest, // Mock implementation
    fn: () => jest.fn(), // Mock function
    spyOn: () => jest.fn(), // Spy on a function
    clearAllMocks: () => {}, // Clear all mocks
    resetAllMocks: () => {} // Reset all mocks
  };
}

const { beforeEach, afterEach, jest, describe, it, test, expect } = require('@jest/globals');

const React = require('react');

// Mock react-native first, before any other mocks
// To avoid circular dependency, define the mock directly instead of requiring it
jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn(styles => styles), // Returns the styles object as is
      flatten: jest.fn(styles => styles), // Returns the styles as is
    },
    Platform: {
      OS: 'ios', // Mocking the platform as iOS
      select: jest.fn(obj => obj.ios || obj.default), // Mocking platform-specific selections
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })), // Mocking screen dimensions
    },
    NativeModules: {}, // Mocking NativeModules (empty object for now)
    I18nManager: { isRTL: false }, // Mocking I18nManager (internationalization)
    PixelRatio: { get: jest.fn(() => 2) }, // Mocking PixelRatio
    Alert: { alert: jest.fn() }, // Mocking Alert
    Linking: { openURL: jest.fn() }, // Mocking Linking
    Animated: { // Mocking Animated API
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
        setValue: jest.fn(),
      })),
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      createAnimatedComponent: jest.fn(component => component),
    },
    // Mocking core React Native components with simple implementations.  These mocks
    // simply return the name of the component as a string, allowing us to test
    // that they are rendered without actually rendering their complex native implementations.
    View: ({ children, ...props }) => React.createElement('View', props, children),
    Text: ({ children, ...props }) => React.createElement('Text', props, children),
    TouchableOpacity: ({ children, ...props }) => React.createElement('TouchableOpacity', props, children),
    TextInput: ({ children, ...props }) => React.createElement('TextInput', props, children),
    ScrollView: ({ children, ...props }) => React.createElement('ScrollView', props, children),
    Image: ({ children, ...props }) => React.createElement('Image', props, children),
    FlatList: ({ children, ...props }) => React.createElement('FlatList', props, children),
    ActivityIndicator: ({ children, ...props }) => React.createElement('ActivityIndicator', props, children),
    Button: ({ children, ...props }) => React.createElement('Button', props, children),
    Modal: ({ children, ...props }) => React.createElement('Modal', props, children),
    Pressable: ({ children, ...props }) => React.createElement('Pressable', props, children),
    KeyboardAvoidingView: ({ children, ...props }) => React.createElement('KeyboardAvoidingView', props, children),
    SafeAreaView: ({ children, ...props }) => React.createElement('SafeAreaView', props, children),
  };
});

// Define a mockComponent function at the top level to avoid duplication
const mockComponent = (name) => {
  const component = (props) => {
    return {
      type: name,
      props: props,
      children: props.children
    };
  };
  component.displayName = name;
  return component;
};

// Mock for useColorScheme.  We default to 'light' mode for testing.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'), // Default to light mode for testing
}));

// Mock react-native-permissions.  This uses a separate mock file for clarity.
jest.mock('react-native-permissions', () => require('./__mocks__/react-native-permissions').default);

// Mock react-native-device-info.  Provides consistent device information for testing.
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getSystemName: jest.fn(() => 'iOS'),
  getSystemVersion: jest.fn(() => '14.0'),
  getModel: jest.fn(() => 'iPhone 12'),
  getDeviceId: jest.fn(() => 'iPhone13,3'),
  getUniqueId: jest.fn(() => 'unique-device-id'),
  getBundleId: jest.fn(() => 'com.nightvibes.app'),
}));

// Mock react-native-safe-area-context.  Provides consistent safe area insets.
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-map-gl.  Provides simplified components for map rendering in tests.
jest.mock('react-map-gl', () => ({
    Map: ({ children }) => React.createElement('div', { 'data-testid': 'map' }, children),
    Marker: ({ children }) => React.createElement('div', { 'data-testid': 'marker' }, children),
    NavigationControl: () => React.createElement('div', { 'data-testid': 'navigation-control' }),
    GeolocateControl: () => React.createElement('div', { 'data-testid': 'geolocate-control' }),
    Popup: ({ children }) => React.createElement('div', { 'data-testid': 'popup' }, children),
    Source: ({ children }) => React.createElement('div', { 'data-testid': 'source' }, children),
    Layer: () => React.createElement('div', { 'data-testid': 'layer' }),
}));

// Mock ThemeContext. Uses a separate mock file.
jest.mock('./context/ThemeContext', () => require('./__mocks__/ThemeContext'));

// Mock AuthContext. Uses a separate mock file.
jest.mock('./AuthContext', () => require('./__mocks__/AuthContext'));

// Mock React Navigation.  Provides a mock navigation object to avoid errors during testing.
jest.mock('@react-navigation/native', () => {
    const mockNavObj = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn(() => jest.fn()),
        setOptions: jest.fn(),
        dispatch: jest.fn(),
        isFocused: jest.fn(() => true),
        getState: jest.fn(() => ({})),
        getParent: jest.fn(() => null),
        setParams: jest.fn(),
    };
    
    return {
        useNavigation: () => mockNavObj,
        useRoute: () => ({ params: {} }),
        useIsFocused: () => true,
        NavigationContainer: ({ children }) => children,
        NavigationContext: {
            Provider: ({ children, value }) => children,
        },
        createNavigationContainerRef: jest.fn(() => ({
            current: mockNavObj,
        })),
    };
});

// Mock axiosInstance. Uses a separate mock file.
jest.mock('./axiosInstance', () => require('./__mocks__/axiosInstance'));

// Mock AsyncStorage.  Provides a basic in-memory implementation for testing.
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve(null)),
    multiRemove: jest.fn(() => Promise.resolve(null)),
}));

// Mock geolocation. Provides a consistent location for testing.
const geolocationMock = {
    getCurrentPosition: jest.fn(success => success({
        coords: {
            latitude: 37.7749, // Example latitude (San Francisco)
            longitude: -122.4194, // Example longitude (San Francisco)
            altitude: 0,
            accuracy: 5,
            altitudeAccuracy: 5,
            heading: 0,
            speed: 0,
        },
        timestamp: Date.now(),
    })),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
};

global.navigator.geolocation = geolocationMock;

// Mock fetch.  Provides a basic mock for network requests.
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        status: 200,
        ok: true,
    })
);

// Mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
    setString: jest.fn(),
    getString: jest.fn(() => Promise.resolve('')),
}));

// Mock react-native-reanimated.  Uses the mock provided by the library.
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { }; // Avoids errors related to native calls
    return Reanimated;
});

// Mock react-native-gesture-handler. Provides basic implementations for gesture handling components.
jest.mock('react-native-gesture-handler', () => {
    return {
        Swipeable: React.forwardRef((props, ref) => React.createElement('Swipeable', { ...props, ref }, props.children)),
        DrawerLayout: React.forwardRef((props, ref) => React.createElement('DrawerLayout', { ...props, ref }, props.children)),
        State: {},
        ScrollView: React.forwardRef((props, ref) => React.createElement('ScrollView', { ...props, ref }, props.children)),
        Slider: React.forwardRef((props, ref) => React.createElement('Slider', { ...props, ref }, props.children)),
        Switch: React.forwardRef((props, ref) => React.createElement('Switch', { ...props, ref }, props.children)),
        TextInput: React.forwardRef((props, ref) => React.createElement('TextInput', { ...props, ref }, props.children)),
        ToolbarAndroid: React.forwardRef((props, ref) => React.createElement('ToolbarAndroid', { ...props, ref }, props.children)),
        ViewPagerAndroid: React.forwardRef((props, ref) => React.createElement('ViewPagerAndroid', { ...props, ref }, props.children)),
        DrawerLayoutAndroid: React.forwardRef((props, ref) => React.createElement('DrawerLayoutAndroid', { ...props, ref }, props.children)),
        WebView: React.forwardRef((props, ref) => React.createElement('WebView', { ...props, ref }, props.children)),
        NativeViewGestureHandler: React.forwardRef((props, ref) => React.createElement('NativeViewGestureHandler', { ...props, ref }, props.children)),
        TapGestureHandler: React.forwardRef((props, ref) => React.createElement('TapGestureHandler', { ...props, ref }, props.children)),
        FlingGestureHandler: React.forwardRef((props, ref) => React.createElement('FlingGestureHandler', { ...props, ref }, props.children)),
        ForceTouchGestureHandler: React.forwardRef((props, ref) => React.createElement('ForceTouchGestureHandler', { ...props, ref }, props.children)),
        LongPressGestureHandler: React.forwardRef((props, ref) => React.createElement('LongPressGestureHandler', { ...props, ref }, props.children)),
        PanGestureHandler: React.forwardRef((props, ref) => React.createElement('PanGestureHandler', { ...props, ref }, props.children)),
        PinchGestureHandler: React.forwardRef((props, ref) => React.createElement('PinchGestureHandler', { ...props, ref }, props.children)),
        RotationGestureHandler: React.forwardRef((props, ref) => React.createElement('RotationGestureHandler', { ...props, ref }, props.children)),
        RawButton: React.forwardRef((props, ref) => React.createElement('RawButton', { ...props, ref }, props.children)),
        BaseButton: React.forwardRef((props, ref) => React.createElement('BaseButton', { ...props, ref }, props.children)),
        RectButton: React.forwardRef((props, ref) => React.createElement('RectButton', { ...props, ref }, props.children)),
        BorderlessButton: React.forwardRef((props, ref) => React.createElement('BorderlessButton', { ...props, ref }, props.children)),
        Direction: {},
    };
});

// Mock expo-font
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(() => Promise.resolve()),
    useFonts: jest.fn(() => [true, null]),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({
        coords: {
            latitude: 37.7749,
            longitude: -122.4194,
            altitude: 0,
            accuracy: 5,
            altitudeAccuracy: 5,
            heading: 0,
            speed: 0,
        },
        timestamp: Date.now(),
    })),
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    LocationAccuracy: {
        Balanced: 0,
        High: 0,
        Highest: 0,
        Low: 0,
        Lowest: 0,
    },
}));

// Define __DEV__ for testing environment
global.__DEV__ = true;

// Define global.Storage for ThemeContext tests
global.Storage = class {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
};

// Set up localStorage mock
global.localStorage = new Storage();

// Mock Platform.OS and Platform.select
jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform');
    Platform.OS = 'ios'; // Set the platform to iOS for testing
    Platform.select = jest.fn((obj) => obj.ios || obj.default);
    return Platform;
});

// Mock NativeModules for UIManager and PlatformConstants
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => {
    return {
        UIManager: {
            RCTView: {}, // Mock RCTView
        },
        PlatformConstants: {
            forceTouchAvailable: false, // Mock forceTouchAvailable
        },
    };
});

// Mock UIManager
jest.mock('react-native/Libraries/ReactNative/UIManager', () => ({
    RCTView: {},
    blur: jest.fn(),
    focus: jest.fn(),
    measure: jest.fn(),
    measureInWindow: jest.fn(),
    measureLayout: jest.fn(),
    updateView: jest.fn(),
    removeSubviews: jest.fn(),
    manageChildren: jest.fn(),
    replaceExistingNonRootView: jest.fn(),
    customBubblingEventTypes: jest.fn(),
    customDirectEventTypes: jest.fn(),
    createView: jest.fn(),
    setChildren: jest.fn(),
    configureNextLayoutAnimation: jest.fn(),
    setLayoutAnimationEnabledExperimental: jest.fn(),
    dispatchViewManagerCommand: jest.fn(),
    showPopupMenu: jest.fn(),
    dismissPopupMenu: jest.fn(),
    sendAccessibilityEvent: jest.fn(),
    setJSResponder: jest.fn(),
    clearJSResponder: jest.fn(),
    hotspotUpdate: jest.fn(),
    setGestureRecognizerSimultaneousRecognitionPolicy: jest.fn(),
    getConstants: jest.fn(() => ({
        ViewConfig: {
            validAttributes: {},
            uiViewClassName: 'RCTView',
        },
        forceTouchAvailable: false,
    })),
}));

// Mock for lucide-react-native icons.  This avoids rendering the actual SVG icons
// during testing, which can cause issues.  We replace them with simple components.
jest.mock('lucide-react-native', () => ({
    ArrowLeft: () => React.createElement('ArrowLeftIcon'),
    Menu: () => React.createElement('MenuIcon'),
    Search: () => React.createElement('SearchIcon'),
    Filter: () => React.createElement('FilterIcon'),
    MapPin: () => React.createElement('MapPinIcon'),
    Star: () => React.createElement('StarIcon'),
    Activity: () => React.createElement('ActivityIcon'),
    Loader: () => React.createElement('LoaderIcon'),
    Map: () => React.createElement('MapIcon'),
    List: () => React.createElement('ListIcon'),
    Clock: () => React.createElement('ClockIcon'),
    Users: () => React.createElement('UsersIcon'),
    User: () => React.createElement('UserIcon'),
    UserPlus: () => React.createElement('UserPlusIcon'),
    TrendingUp: () => React.createElement('TrendingUpIcon'),
    Settings: () => React.createElement('SettingsIcon'),
    Bell: () => React.createElement('BellIcon'),
    Home: () => React.createElement('HomeIcon'),
    LogOut: () => React.createElement('LogOutIcon'),
    Heart: () => React.createElement('HeartIcon'),
    MessageSquare: () => React.createElement('MessageSquareIcon'),
    Camera: () => React.createElement('CameraIcon'),
    Check: () => React.createElement('CheckIcon'),
    X: () => React.createElement('XIcon'),
    Mail: () => React.createElement('MailIcon'),
    Lock: () => React.createElement('LockIcon'),
    ChevronRight: () => React.createElement('ChevronRightIcon'),
}));

// Mock for jwt-decode
jest.mock('jwt-decode', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        user_id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        exp: Date.now() / 1000 + 3600, // Valid for 1 hour
    })),
}));

// Make these global for tests that use them
import { defaultAuthState } from './__mocks__/AuthContext';
import { defaultThemeState } from './__mocks__/ThemeContext';

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    // Reset AuthContext mock
    for (const key in defaultAuthState) {
        if (typeof defaultAuthState[key] === 'function') {
            defaultAuthState[key].mockClear();
        }
    }

    // Reset ThemeContext mock (if needed)
    for (const key in defaultThemeState) {
        if (typeof defaultThemeState[key] === 'function') {
            defaultThemeState[key].mockClear();
        }
    }
});

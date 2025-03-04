// Define __DEV__ globally
global.__DEV__ = true;

// Define Jest globals in the global scope so they're available in imported files
const jestGlobals = require('@jest/globals');

// Explicitly define Jest globals
global.jest = global.jest || jestGlobals.jest;
global.beforeEach = global.beforeEach || jestGlobals.beforeEach;
global.afterEach = global.afterEach || jestGlobals.afterEach;
global.beforeAll = global.beforeAll || jestGlobals.beforeAll;
global.afterAll = global.afterAll || jestGlobals.afterAll;
global.describe = global.describe || jestGlobals.describe;
global.it = global.it || jestGlobals.it;
global.test = global.test || jestGlobals.test;
global.expect = global.expect || jestGlobals.expect;

// If needed, restore the Node.js environment that Jest sets up
// This ensures Jest's globals are properly defined
if (typeof global.jasmine === 'undefined') {
  global.jasmine = {};
}

// Mock React Native components and modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock NativeModules
  RN.NativeModules = {
    ...RN.NativeModules,
    RNGestureHandlerModule: {
      attachGestureHandler: jest.fn(),
      createGestureHandler: jest.fn(),
      dropGestureHandler: jest.fn(),
      updateGestureHandler: jest.fn(),
      State: {},
      Directions: {},
    },
    StatusBarManager: {
      HEIGHT: 42,
      setStyle: jest.fn(),
      setHidden: jest.fn(),
      setNetworkActivityIndicatorVisible: jest.fn(),
      setBackgroundColor: jest.fn(),
      setTranslucent: jest.fn(),
    },
    UIManager: {
      ...RN.UIManager,
      getViewManagerConfig: jest.fn((name) => {
        if (name === 'RCTView') {
          return {
            Constants: {},
          };
        }
        return {};
      }),
    },
    RNPermissions: {
      check: jest.fn(),
      request: jest.fn(),
    },
  };

  // Mock Dimensions
  RN.Dimensions = {
    ...RN.Dimensions,
    get: jest.fn().mockReturnValue({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    }),
  };

  // Mock PixelRatio
  RN.PixelRatio = {
    ...RN.PixelRatio,
    get: jest.fn().mockReturnValue(2),
    getFontScale: jest.fn().mockReturnValue(1),
    getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
    roundToNearestPixel: jest.fn((size) => size),
  };

  // Mock Platform
  RN.Platform = {
    ...RN.Platform,
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  };

  return RN;
});

// Mock other react-native related modules
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: jest.fn().mockReturnValue({
    top: 44,
    right: 0,
    bottom: 34,
    left: 0,
  }),
}));

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn().mockImplementation((Component) => Component),
    Directions: {},
  };
}); 
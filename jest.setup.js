import 'react-native-gesture-handler/jestSetup';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
        useRoute: () => ({
            params: {}
        })
    };
});

// jest.mock('react-native-reanimated', () => {
//   const Reanimated = require('react-native-reanimated/mock');

//   // The mock for `call` immediately calls the callback which is incorrect
//   // So we override it with a no-op
//   Reanimated.default.call = () => {};

//   return Reanimated;
// });

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: ({ children }) => <>{children}</>,
    SafeAreaProvider: ({ children }) => <>{children}</>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  }
});

jest.mock('react-native-permissions', () => {
    return {
        check: jest.fn(),
        request: jest.fn(),
        PERMISSIONS: {
            IOS: {
                LOCATION_WHEN_IN_USE: 'locationWhenInUse',
            },
            ANDROID: {
                ACCESS_FINE_LOCATION: 'accessFineLocation',
            },
        },
        RESULTS: {
            UNAVAILABLE: 'unavailable',
            DENIED: 'denied',
            LIMITED: 'limited',
            GRANTED: 'granted',
            BLOCKED: 'blocked',
        },
    };
});

jest.mock('@react-native-community/checkbox', () => {
  const React = require('react');
  return ({
    __esModule: true,
    default: jest.fn(({ value, onValueChange, ...props }) => (
      <input type="checkbox" checked={value} onChange={() => onValueChange(!value)} {...props} />
    )),
  });
});

// Mock react-native
jest.mock('react-native', () => {
  const React = require('react');
  
  const MockModal = ({ visible, children, onRequestClose }) => {
    if (!visible) {
      return null;
    }
    return (
      <>
        {children}
        <div data-testid="close-button" onClick={onRequestClose}></div>
      </>
    );
  };

  const MockVirtualizedList = ({ children }) => <div>{children}</div>;

  return {
    Modal: MockModal,
    VirtualizedList: MockVirtualizedList,
    FlatList: MockVirtualizedList,
    SectionList: MockVirtualizedList,
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => style,
    },
    NativeModules: {
      DeviceInfo: {
        getConstants: () => ({}),
      },
      SettingsManager: {
        getConstants: () => ({}),
      },
    },
    View: ({ children, ...props }) => <div {...props}>{children}</div>,
    Text: ({ children, ...props }) => <span {...props}>{children}</span>,
    TouchableOpacity: ({ children, onPress, ...props }) => (
      <div onClick={onPress} {...props}>{children}</div>
    ),
    TouchableWithoutFeedback: ({ children, onPress, ...props }) => (
      <div onClick={onPress} {...props}>{children}</div>
    ),
    ActivityIndicator: () => <div>Loading...</div>,
    Image: ({ source, ...props }) => <img src={source} {...props} />,
    TextInput: ({ value, onChangeText, ...props }) => (
      <input 
        value={value} 
        onChange={(e) => onChangeText(e.target.value)} 
        {...props} 
      />
    ),
    ScrollView: ({ children, ...props }) => <div {...props}>{children}</div>,
    Animated: {
      View: ({ children, ...props }) => <div {...props}>{children}</div>,
      Text: ({ children, ...props }) => <span {...props}>{children}</span>,
      createAnimatedComponent: (Component) => Component,
      timing: () => ({
        start: (callback) => {
          if (callback) callback({ finished: true });
        },
      }),
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
        setValue: jest.fn(),
      })),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    useColorScheme: jest.fn(() => 'light'),
  };
});

// Define __DEV__ for testing
global.__DEV__ = true;

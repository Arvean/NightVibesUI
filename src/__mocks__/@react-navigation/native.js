import React from 'react';

// Default navigation mock
const defaultNavigation = {
  navigate: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn((event, callback) => {
    if (event === 'focus') {
      callback();
    }
    return jest.fn(); // Return mockUnsubscribe
  }),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(() => null),
  getState: jest.fn(() => ({
    routes: [{ name: 'Home' }],
    index: 0,
  })),
};

// Default route mock
const defaultRoute = {
  key: 'default-key',
  name: 'Home',
  params: {},
};

// Mocked components
const NavigationContainer = ({ children }) => React.createElement('NavigationContainer', {}, children);

// Mock Navigator components
const DefaultTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

// Navigation State Context
const NavigationContext = React.createContext(defaultNavigation);
NavigationContext.displayName = 'NavigationContext';

// Navigation Route Context
const NavigationRouteContext = React.createContext(defaultRoute);
NavigationRouteContext.displayName = 'NavigationRouteContext';

// Hooks
const useNavigation = jest.fn().mockReturnValue(defaultNavigation);
const useRoute = jest.fn().mockReturnValue(defaultRoute);
const useNavigationState = jest.fn().mockReturnValue({ routes: [{ name: 'Home' }], index: 0 });

const useFocusEffect = jest.fn((callback) => {
  React.useEffect(() => {
    const callbackFn = callback();
    return callbackFn;
  }, [callback]);
});

const useIsFocused = jest.fn().mockReturnValue(true);

// Other exports
const CommonActions = {
  navigate: jest.fn((name, params) => ({ type: 'NAVIGATE', payload: { name, params } })),
  reset: jest.fn((state) => ({ type: 'RESET', payload: state })),
  goBack: jest.fn(() => ({ type: 'GO_BACK' })),
  setParams: jest.fn((params) => ({ type: 'SET_PARAMS', payload: params })),
};

// For Jest setupFiles to mock the module
const reactNavigation = {
  NavigationContainer,
  NavigationContext,
  NavigationRouteContext,
  useNavigation,
  useRoute,
  useNavigationState,
  useFocusEffect,
  useIsFocused,
  DefaultTheme,
  DarkTheme,
  CommonActions,
  createNavigationContainerRef: () => ({
    current: defaultNavigation,
  }),
};

// Add all exports to module.exports to support commonjs
Object.keys(reactNavigation).forEach(key => {
  module.exports[key] = reactNavigation[key];
});

// Default export
export default reactNavigation;
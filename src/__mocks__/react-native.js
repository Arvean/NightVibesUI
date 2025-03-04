const React = require('react');

global.__DEV__ = true;

// Define reusable mock components
const mockComponent = (name) => {
  const Component = ({ children, ...props }) => {
    return React.createElement(
      'div', 
      { 
        'data-testid': `mock-${name.toLowerCase()}`,
        ...props
      },
      children
    );
  };
  Component.displayName = name;
  return Component;
};

const Modal = ({ visible, transparent, animationType, onRequestClose, children, ...props }) => {
  if (!visible) return null;
  return React.createElement(
    'div',
    {
      'data-testid': 'modal-view',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: transparent ? 'transparent' : 'white'
      },
      ...props
    },
    children
  );
};

// Export both as named and default
module.exports = {
  Modal,
  View: mockComponent('View'),
  Text: mockComponent('Text'),
  TouchableOpacity: mockComponent('TouchableOpacity'),
  TextInput: mockComponent('TextInput'),
  ActivityIndicator: mockComponent('ActivityIndicator'),
  StyleSheet: {
    create: styles => styles,
  },
};

module.exports.Modal = Modal;

// Other named exports
export const View = mockComponent('View');
export const Text = mockComponent('Text');
export const TextInput = mockComponent('TextInput');
export const TouchableOpacity = mockComponent('TouchableOpacity');
export const TouchableWithoutFeedback = mockComponent('TouchableWithoutFeedback');
export const Image = mockComponent('Image');
export const ScrollView = mockComponent('ScrollView');
export const FlatList = mockComponent('FlatList');
export const ActivityIndicator = mockComponent('ActivityIndicator');
export const StyleSheet = {
  create: styles => styles,
  flatten: style => style,
};
export const Platform = {
  OS: 'ios',
  select: jest.fn(obj => obj.ios)
};
export const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 }))
};
export const Animated = {
  View: mockComponent('AnimatedView'),
  Text: mockComponent('AnimatedText'),
  Image: mockComponent('AnimatedImage'),
  createAnimatedComponent: jest.fn(component => component),
  timing: jest.fn(() => ({
    start: jest.fn(callback => {
      if (callback) callback({ finished: true });
    }),
  })),
  spring: jest.fn(() => ({
    start: jest.fn(callback => {
      if (callback) callback({ finished: true });
    }),
  })),
  Value: jest.fn(() => ({
    setValue: jest.fn(),
    interpolate: jest.fn(() => ({
      interpolate: jest.fn(),
    })),
  })),
};

export const VirtualizedList = mockComponent('VirtualizedList');
export const SectionList = mockComponent('SectionList');

// Default export to support both import styles
export default {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  VirtualizedList,
  SectionList,
};

const React = require('react');
const RN = jest.requireActual('react-native');

const MockModal = ({ visible, children, onRequestClose }) => {
  if (!visible) {
    return null; // Render nothing when not visible
  }
  return (
    <React.Fragment>
      {children}
      <div data-testid="close-button" onClick={onRequestClose}></div>
    </React.Fragment>
  )
};

const MockVirtualizedList = ({ children }) => <RN.View>{children}</RN.View>;

module.exports = {
  NativeModules: {
    SettingsManager: {
      settings: {
        AppleLanguages: ['en'],
        AppleLocale: 'en_US',
      },
      getConstants: () => ({
        settings: {
          AppleLanguages: ['en'],
          AppleLocale: 'en_US',
        }
      }),
    },
  },
  ...RN, // Spread the actual react-native module
  StyleSheet: {
    create: (styles) => styles,
  },
  Modal: MockModal, // Override only the Modal component
  VirtualizedList: MockVirtualizedList,
  FlatList: MockVirtualizedList,
  SectionList: MockVirtualizedList,
};

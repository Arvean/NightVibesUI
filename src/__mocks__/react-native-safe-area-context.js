import React from 'react';

const SafeAreaContext = React.createContext({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const SafeAreaProvider = ({ children }) => {
  return <>{children}</>;
};

const SafeAreaConsumer = ({ children }) => {
  return children({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
};

const SafeAreaView = ({ children, style, ...props }) => {
  return (
    <div data-testid="safe-area-view" style={style} {...props}>
      {children}
    </div>
  );
};

const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: 390,
  height: 844,
});

const initialWindowMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export {
  SafeAreaProvider,
  SafeAreaConsumer,
  SafeAreaView,
  SafeAreaContext,
  useSafeAreaInsets,
  useSafeAreaFrame,
  initialWindowMetrics,
};

export default {
  SafeAreaProvider,
  SafeAreaConsumer, 
  SafeAreaView,
  SafeAreaContext,
  useSafeAreaInsets,
  useSafeAreaFrame,
  initialWindowMetrics,
}; 
import React from 'react';

const mockStack = {
  Navigator: ({ children, initialRouteName, screenOptions }) => {
    // Find the initial screen component based on initialRouteName or default to first child
    let initialScreen = null;
    React.Children.forEach(children, child => {
      if (child.props.name === initialRouteName) {
        initialScreen = child;
      }
    });
    
    // If no initialRouteName was specified, use the first screen
    if (!initialScreen && React.Children.count(children) > 0) {
      initialScreen = React.Children.toArray(children)[0];
    }
    
    if (initialScreen) {
      const Component = initialScreen.props.component;
      return <Component />;
    }
    
    return null;
  },
  Screen: ({ name, component, options, children }) => {
    return children || null;
  },
};

const createStackNavigator = () => mockStack;

export { createStackNavigator };

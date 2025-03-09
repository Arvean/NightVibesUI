// src/navigation/index.js

// Import React and the useContext hook.
import React, {useContext} from 'react';
// Import the NavigationContainer component from React Navigation.
import {NavigationContainer} from '@react-navigation/native';
// Import the AuthContext to check for user authentication.
import {AuthContext} from '../context/AuthContext';
// Import the navigators for authenticated and unauthenticated users.
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Define the RootNavigator component.
export default function RootNavigator() {
  // Access the userToken from the AuthContext.
  const {userToken} = useContext(AuthContext);

  // Return the NavigationContainer, which wraps the appropriate navigator.
  return (
    <NavigationContainer>
      {/* Conditionally render either the MainNavigator or the AuthNavigator 
          based on the presence of a userToken. */}
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

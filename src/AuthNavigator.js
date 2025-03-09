// Import React and useContext hook.
import React from 'react';
// Import createStackNavigator for navigation.
import { createStackNavigator } from '@react-navigation/stack';
// Import screen components.
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import TermsScreen from './TermsScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoadingScreen from './LoadingScreen';
// Import useContext to access authentication context
import { useContext } from 'react';
// Import AuthContext
import { AuthContext } from './AuthContext';

// Create a stack navigator.
const Stack = createStackNavigator();

// Define default screen options for the navigator.
const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff', // White background for header
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: '#f3f4f6', // Light gray border color
  },
  headerTitleStyle: {
    fontSize: 18, // Font size for header title
    fontWeight: '600', // Bold font weight
    color: '#111827', // Dark text color
  },
  headerTintColor: '#3b82f6', // Blue color for header text and back button
  headerBackTitleVisible: false, // Hide back button title
  headerLeftContainerStyle: {
    paddingLeft: 16, // Add padding to the left of the header
  },
  headerRightContainerStyle: {
    paddingRight: 16, // Add padding to the right of the header
  },
};

// Define the AuthNavigator component.
export default function AuthNavigator() {
  // Access isLoading state from AuthContext
  const { isLoading } = useContext(AuthContext);

  // Show LoadingScreen while checking authentication status
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Return the stack navigator with screen components.
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* Login Screen */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In', // Set screen title
          headerShown: false, // Hide header for login screen
        }}
      />
      {/* Register Screen */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account', // Set screen title
          headerShown: false, // Hide header for register screen
        }}
      />
      {/* Terms and Conditions Screen */}
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: 'Terms & Conditions', // Set screen title
          headerShown: true, // Show header for terms screen
        }}
      />
      {/* Forgot Password Screen */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password', // Set screen title
          headerShown: true, // Show header for forgot password screen
        }}
      />
    </Stack.Navigator>
  );
}

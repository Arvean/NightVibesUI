import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import TermsScreen from './TermsScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoadingScreen from './LoadingScreen';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0, // Android
    shadowOpacity: 0, // iOS
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerTintColor: '#3b82f6',
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: 16,
  },
  headerRightContainerStyle: {
    paddingRight: 16,
  },
};

export default function AuthNavigator() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

import React, { useContext, useState } from 'react';
// Importing necessary components from 'react-native'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// Importing AuthContext for authentication
import { AuthContext } from './AuthContext';
// Importing UI components from '@/components/ui/*'
import { Text, TextInput, Button } from '@/components/ui';
// Importing icons from 'lucide-react-native'
import { Lock, Mail, AlertCircle } from 'lucide-react-native';
// Importing SafeAreaView for safe area handling
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * LoginScreen Component:
 * - Displays a login form for users to sign in.
 * - Handles form validation and authentication using AuthContext.
 * - Allows navigation to the registration and forgot password screens.
 */
export default function LoginScreen({ navigation }) {
  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // State variable for form errors
  const [errors, setErrors] = useState({});
  // Accessing login function, loading state, and error from AuthContext
  const { login, isLoading, error: authError } = useContext(AuthContext);

  // Function to validate the login form
  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle the login process
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(username, password);
      } catch (error) {
        // Error handling is managed by AuthContext
      }
    }
  };

  // Main return statement for rendering the LoginScreen component
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Display authentication error if there is one */}
          {authError && (
            <View style={styles.errorContainer}>
              <AlertCircle color="#ef4444" size={20} />
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          )}

          {/* Login Form */}
          <View style={styles.form}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Mail color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors((prev) => ({ ...prev, username: null }));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.username && (
                <Text style={styles.errorMessage}>{errors.username}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && (
                <Text style={styles.errorMessage}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password Button */}
            <Button
              title="Forgot Password?"
              variant="ghost"
              // Transition to ForgotPassword screen
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={isLoading}
              style={styles.forgotButton}
            />

            {/* Sign In Button */}
            <Button
              title={isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.button}
            />

            {/* Register Navigation */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              {/* Button to navigate to Register screen */}
              <Button
                title="Register"
                variant="ghost"
                onPress={() => navigation.navigate('Register')}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles for the LoginScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingLeft: 44,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    flex: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerText: {
    color: '#6b7280',
  },
});

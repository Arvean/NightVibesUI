import React, { useContext, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../AuthContext';
import { Text, TextInput, Button, Checkbox } from '@/components/ui';
import { Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const { register, isLoading, error: authError } = useContext(AuthContext);

  const validatePassword = (pass) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  };

  const validateForm = () => {
    const newErrors = {};
    setServerErrors({});
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Password must meet all requirements';
      newErrors.passwordRequirements = passwordValidation.requirements;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register(username, email, password);
        // Registration successful - navigation will be handled by AuthContext
      } catch (error) {
        const serverErrors = {};
        if (error.response?.data) {
          // Handle Django REST framework error format
          Object.entries(error.response.data).forEach(([key, value]) => {
            serverErrors[key] = Array.isArray(value) ? value[0] : value;
          });
        } else {
          serverErrors.general = 'Registration failed. Please try again.';
        }
        setServerErrors(serverErrors);
      }
    }
  };

  const renderPasswordRequirements = () => {
    if (!password || !errors.passwordRequirements) return null;

    const requirements = [
      { key: 'length', label: 'At least 8 characters' },
      { key: 'uppercase', label: 'One uppercase letter' },
      { key: 'lowercase', label: 'One lowercase letter' },
      { key: 'number', label: 'One number' },
      { key: 'special', label: 'One special character' },
    ];

    return (
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password requirements:</Text>
        {requirements.map(({ key, label }) => (
          <View key={key} style={styles.requirementRow}>
            <CheckCircle2
              size={16}
              color={errors.passwordRequirements[key] ? '#22c55e' : '#6b7280'}
            />
            <Text
              style={[
                styles.requirementText,
                errors.passwordRequirements[key] && styles.requirementMet,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the nightlife community</Text>
          </View>

          {(authError || serverErrors.general) && (
            <View style={styles.errorContainer}>
              <AlertCircle color="#ef4444" size={20} />
              <Text style={styles.errorText}>
                {authError || serverErrors.general}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  (errors.username || serverErrors.username) && styles.inputError,
                ]}
                placeholder="Username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors((prev) => ({ ...prev, username: null }));
                  setServerErrors((prev) => ({ ...prev, username: null }));
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {(errors.username || serverErrors.username) && (
                <Text style={styles.errorMessage}>
                  {errors.username || serverErrors.username}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Mail color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  (errors.email || serverErrors.email) && styles.inputError,
                ]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: null }));
                  setServerErrors((prev) => ({ ...prev, email: null }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {(errors.email || serverErrors.email) && (
                <Text style={styles.errorMessage}>
                  {errors.email || serverErrors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Lock color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  (errors.password || serverErrors.password) && styles.inputError,
                ]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: null }));
                  setServerErrors((prev) => ({ ...prev, password: null }));
                }}
                secureTextEntry
              />
              {renderPasswordRequirements()}
              {(errors.password || serverErrors.password) && (
                <Text style={styles.errorMessage}>
                  {errors.password || serverErrors.password}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Lock color="#6b7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
              )}
            </View>

            <View style={styles.termsContainer}>
              <Checkbox
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                aria-label="Accept terms and conditions"
              />
              <Text style={styles.termsText}>
                I accept the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('Terms')}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </View>
            {errors.terms && (
              <Text style={styles.errorMessage}>{errors.terms}</Text>
            )}

            <Button
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Button
                title="Sign In"
                variant="ghost"
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    color: '#6b7280',
  },
  requirementsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#6b7280',
  },
  requirementMet: {
    color: '#22c55e',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  termsLink: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});

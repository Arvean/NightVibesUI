import React, { useContext, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
// Importing AuthContext for authentication.
import { AuthContext } from './AuthContext';
// Importing custom UI components.
import { Button } from './components/ui/Button';
// Importing Checkbox from '@react-native-community/checkbox'.
import Checkbox from '@react-native-community/checkbox';
// Importing icons from 'lucide-react-native'.
import { Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// RegisterScreen component for user registration.
const RegisterScreen = () => {
    // Accessing the register function from AuthContext.
    const { register } = useContext(AuthContext);

    // State variables for user input.
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // State variables for error handling, success message, and loading indicator.
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Function to handle the registration process.
    const handleRegister = async () => {
        // Validate that passwords match.
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        // Validate that the user has agreed to the terms.
        if (!agreeToTerms) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Call the register function from AuthContext.
            await register(username, email, password);
            setSuccess(true);
        } catch (err) {
            // Set error message based on API response or a generic message.
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Use KeyboardAvoidingView to prevent the keyboard from covering the input fields. */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create an Account</Text>

                    {/* Display error message if there's an error. */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <AlertCircle size={20} color="#e74c3c" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Display success message if registration was successful. */}
                    {success ? (
                        <View style={styles.successContainer}>
                            <CheckCircle2 size={20} color="#2ecc71" />
                            <Text style={styles.successText}>Registration successful! Please log in.</Text>
                        </View>
                    ) : null}

                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <User size={20} color="#3498db" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Mail size={20} color="#3498db" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Lock size={20} color="#3498db" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Lock size={20} color="#3498db" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Terms and Conditions Checkbox */}
                    <View style={styles.termsContainer}>
                        <Checkbox
                            value={agreeToTerms}
                            onValueChange={setAgreeToTerms}
                            testID="terms-checkbox"
                        />
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.termsLink} onPress={() => { /* Navigate to TermsScreen */ }}>
                                Terms and Conditions
                            </Text>
                        </Text>
                    </View>

                    {/* Register Button */}
                    <Button
                        style={styles.button}
                        title={loading ? "Registering..." : "Register"}
                        onPress={handleRegister}
                        disabled={loading}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// StyleSheet for the RegisterScreen component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light gray background
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#ffffff', // White background for the form
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#3498db', // Blue color for the title
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderColor: '#3498db', // Blue border color for input fields
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#333', // Dark gray text color for input
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    termsText: {
        marginLeft: 10,
        color: '#333', // Dark gray text color for terms text
    },
    termsLink: {
        color: '#3498db', // Blue color for terms link
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#3498db', // Blue background for the button
        padding: 15,
        borderRadius: 5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8d7da', // Light red background for error messages
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 5,
    },
    errorText: {
        marginLeft: 10,
        color: '#721c24', // Dark red color for error text
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#d4edda', // Light green background for success messages
        borderColor: '#c3e6cb',
        borderWidth: 1,
        borderRadius: 5,
    },
    successText: {
        marginLeft: 10,
        color: '#155724', // Dark green color for success text
    },
});

export default RegisterScreen;

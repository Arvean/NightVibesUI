import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import { Button } from './components/ui/Button';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from './axiosInstance';

// ForgotPasswordScreen component allows users to request a password reset.
const ForgotPasswordScreen = () => {
    // State for the user's email.
    const [email, setEmail] = useState('');
    // State for storing any errors that occur.
    const [error, setError] = useState('');
    // State for indicating a successful password reset request.
    const [success, setSuccess] = useState(false);
    // State for indicating whether the request is in progress.
    const [loading, setLoading] = useState(false);

    // Function to handle the password reset request.
    const handleResetPassword = async () => {
        // Set loading to true and clear any previous errors.
        setLoading(true);
        setError('');
        try {
            // Make a POST request to the API to request a password reset.
            const response = await api.post('/api/forgot-password/', { email });
            // If the request is successful, set the success state to true.
            if (response.status === 200) {
                setSuccess(true);
            } else {
                // If the request fails, set the error state.
                setError('Failed to send reset password email. Please try again.');
            }
        } catch (err) {
            // If there's an error, set the error state with the error message from the API or a default message.
            setError(err.response?.data?.message || 'Failed to send reset password email. Please try again.');
        } finally {
            // Set loading to false after the request is complete.
            setLoading(false);
        }
    };

    // Render the ForgotPasswordScreen UI.
    return (
        <SafeAreaView style={styles.container}>
            {/* Use KeyboardAvoidingView to prevent the keyboard from covering the input fields. */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Forgot Password</Text>

                    {/* Display an error message if there's an error. */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <AlertCircle size={20} color="#e74c3c" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Display a success message if the password reset email was sent successfully. */}
                    {success ? (
                        <View style={styles.successContainer}>
                            <CheckCircle2 size={20} color="#2ecc71" />
                            <Text style={styles.successText}>Password reset email sent! Please check your inbox.</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        {/* Icon for the email input field. */}
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

                    {/* Button to submit the password reset request. */}
                    <Button
                        style={styles.button}
                        title={loading ? "Sending..." : "Reset Password"}
                        onPress={handleResetPassword}
                        disabled={loading}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// StyleSheet for the ForgotPasswordScreen component.
const styles = StyleSheet.create({
    // Main container style.
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    // Inner container style.
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // Container for the form elements.
    formContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
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
    // Style for the title.
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#3498db',
    },
    // Container for the input field and icon.
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderColor: '#3498db',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    // Style for the icon.
    icon: {
        marginRight: 10,
    },
    // Style for the input field.
    input: {
        flex: 1,
        height: 40,
        color: '#333',
    },
    // Style for the button.
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
    },
    // Container for error messages.
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 5,
    },
    // Style for error text.
    errorText: {
        marginLeft: 10,
        color: '#721c24',
    },
    // Container for success messages.
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        borderWidth: 1,
        borderRadius: 5,
    },
    // Style for success text.
    successText: {
        marginLeft: 10,
        color: '#155724',
    },
});

// Export the ForgotPasswordScreen component.
export default ForgotPasswordScreen;

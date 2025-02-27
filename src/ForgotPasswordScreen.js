import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import { Button } from './components/ui/Button';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from './axiosInstance';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/forgot-password/', { email });
            if (response.status === 200) {
                setSuccess(true);
            } else {
                setError('Failed to send reset password email. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset password email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Forgot Password</Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <AlertCircle size={20} color="#e74c3c" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {success ? (
                        <View style={styles.successContainer}>
                            <CheckCircle2 size={20} color="#2ecc71" />
                            <Text style={styles.successText}>Password reset email sent! Please check your inbox.</Text>
                        </View>
                    ) : null}

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#3498db',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderColor: '#3498db',
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
        color: '#333',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
    },
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
    errorText: {
        marginLeft: 10,
        color: '#721c24',
    },
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
    successText: {
        marginLeft: 10,
        color: '#155724',
    },
});

export default ForgotPasswordScreen;

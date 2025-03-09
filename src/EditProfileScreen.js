import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './AuthContext';
import axiosInstance from './axiosInstance';
import { useNavigation } from '@react-navigation/native';

// EditProfileScreen component allows users to edit their profile information.
const EditProfileScreen = () => {
  // Access theme context for colors and dark mode status.
  const { colors, isDark } = useTheme();
  // Generate styles based on the current theme.
  const styles = getStyles({ colors, isDark });
  // Access the user object and logout function from the AuthContext.
  const { user, logout } = useContext(AuthContext);
  // State for the user's bio.
  const [bio, setBio] = useState('');
  // State for indicating whether the profile data is loading.
  const [loading, setLoading] = useState(true);
  // State for storing any errors that occur.
  const [error, setError] = useState(null);
  // Add loading state for saving
  const [isSaving, setIsSaving] = useState(false);
  // Access navigation object for navigating between screens
  const navigation = useNavigation();

  // useEffect hook to fetch the user's profile data when the component mounts or the user changes.
  useEffect(() => {
    // Async function to fetch the profile data.
    const fetchProfile = async () => {
      try {
        // Make a GET request to the API to get the user's profile.
        const response = await axiosInstance.get('/api/profile/');
        // If the request is successful, set the bio state.
        if (response.status === 200) {
          setBio(response.data.bio);
        } else {
          // If the request fails, set the error state.
          setError('Failed to fetch profile data.');
        }
      } catch (err) {
        // If there's an error, set the error state and log the error.
        setError('Failed to fetch profile data.');
        console.error(err);
      } finally {
        // Set loading to false after the request is complete.
        setLoading(false);
      }
    };

    // Fetch the profile data if a user is logged in.
    if (user) {
      fetchProfile();
    }
  }, [user]);

    // Function to handle saving the updated profile data
    const handleSave = async() => {
        // Set isSaving to true to indicate that the save operation is in progress
        setIsSaving(true);
        // Clear any previous errors
        setError(null);
        try {
            // Send a PUT request to the API to update the user's profile
            const response = await axiosInstance.put('/api/profile/', {
                bio: bio, // Send the updated bio
            });

            // If the update is successful, display a success message and navigate back
            if (response.status === 200) {
                Alert.alert("Success", "Profile updated successfully!");
                navigation.goBack();
            }
            // If the update fails, set an error message
            else {
                setError('Failed to update profile. Please try again.');
            }
        }
        // Catch any errors that occur during the update
        catch (error) {
            setError('Failed to update profile. Please try again.');
            console.error(error);
        }
        // Set isSaving to false after the save operation is complete (either successful or failed)
        finally {
            setIsSaving(false);
        }
    }

    // If the profile data is still loading, show a loading indicator.
    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
          </View>
        );
      }
    
      // If there was an error fetching the profile data, show an error message.
      if (error) {
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
      }

  // Render the EditProfileScreen UI.
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bio:</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Enter your bio"
        placeholderTextColor={colors.textSecondary}
        multiline
      />
      {/* Add more fields here, e.g., for profile picture */}
      {/* Save button, displays "Saving..." while the update is in progress */}
      <Button title={isSaving ? "Saving..." : "Save Changes"} onPress={handleSave} disabled={isSaving}/>
    </View>
  );
};

// StyleSheet for the EditProfileScreen component.
const getStyles = ({ colors, isDark }) => StyleSheet.create({
    // Main container style.
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    // Style for labels.
    label: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    // Style for the text input.
    input: {
        backgroundColor: colors.inputBackground,
        color: colors.text,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        textAlignVertical: 'top',
        width: '100%',
    },
    // Style for error text.
    errorText: {
        color: colors.error,
        fontSize: 16,
    }
});

// Export the EditProfileScreen component.
export default EditProfileScreen;

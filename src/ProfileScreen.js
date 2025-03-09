import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './AuthContext';
import api from './axiosInstance';
import { useNavigation } from '@react-navigation/native';

// StyleSheet for the ProfileScreen component, adapting to theme colors.
const getStyles = ({ colors, isDark }) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background, // Dynamic background color
    },
    text: {
        color: colors.text, // Dynamic text color
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: colors.error, // Dynamic error color
        fontSize: 16,
    }
});

// ProfileScreen component to display user profile information.
const ProfileScreen = () => {
  // Access theme context for colors and dark mode status.
  const { colors, isDark } = useTheme();
  const styles = getStyles({ colors, isDark });
  // Access user information and logout function from AuthContext.
  const { user, logout } = useContext(AuthContext);
  // State for storing the user's profile data.
  const [profile, setProfile] = useState(null);
  // State for indicating whether the profile data is loading.
  const [loading, setLoading] = useState(true);
  // State for storing any errors that occur.
  const [error, setError] = useState(null);
  // Access navigation object
    const navigation = useNavigation();

  // useEffect hook to fetch the user's profile data when the component mounts and the user is logged in.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make a GET request to the API to get the user's profile.
        const response = await api.get('/api/profile/');
        if (response.status === 200) {
          // If the request is successful, set the profile state.
          setProfile(response.data);
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

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
      </View>
    );
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Show a message if the user is not logged in or profile data is missing
  if (!user || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You must be logged in to view this page.</Text>
      </View>
    )
  }

  // Render the ProfileScreen UI.
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {profile.user.username}</Text>
      <Text style={styles.text}>Email: {profile.user.email}</Text>
      <Text style={styles.text}>Bio: {profile.bio}</Text>
      {/* Add more profile details here */}
      {/* Button to navigate to the EditProfileScreen */}
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      {/* Logout button */}
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
};

export default ProfileScreen;

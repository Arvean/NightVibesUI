import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosInstance from './axiosInstance';
import { AuthContext } from './AuthContext';

// CheckInScreen component allows users to check in to a specific venue.
const CheckInScreen = () => {
  // Access theme context for colors and dark mode status.
  const { colors, isDark } = useTheme();
  // Generate styles based on the current theme.
  const styles = getStyles({ colors, isDark });
  // Access route parameters (venueId in this case).
  const route = useRoute();
  const { venueId } = route.params;
  // Access navigation object for navigating between screens.
  const navigation = useNavigation();

  // Access the user object from the AuthContext
    const { user } = useContext(AuthContext);
  // State for the venue name.
  const [venueName, setVenueName] = useState('');
  // State for the user's selected vibe.
  const [vibe, setVibe] = useState('');
  // State for the check-in visibility (public, friends, private).
  const [visibility, setVisibility] = useState('public'); // Default to public
    // State for an optional user comment
    const [comment, setComment] = useState('');

  // useEffect hook to fetch venue details when the component mounts or venueId changes.
  useEffect(() => {
    // Async function to fetch venue details.
    const fetchVenue = async() => {
      try {
        // Make a GET request to the API to get venue details.
        const response = await axiosInstance.get(`/api/venues/${venueId}/`);
        // Set the venue name state with the response data.
        setVenueName(response.data.name);
      } catch (error) {
        // Log any errors and show an alert to the user.
        console.error("Error fetching venue:", error);
        Alert.alert("Error", "Could not fetch venue details.");
      }
    }
    // Call the fetchVenue function.
    fetchVenue();
  }, [venueId]);

  // Function to handle the check-in process.
  const handleCheckIn = async () => {
    // Check if the user is logged in
    if (!user) {
        Alert.alert("Error", "You must be logged in to check in.");
        return;
    }
    // Validate that a vibe has been selected.
    if (!vibe) {
      Alert.alert("Error", "Please select a vibe.");
      return;
    }
    try {
      // Make a POST request to the API to check in the user.
      const response = await axiosInstance.post('/api/checkins/', {
        user: user.id, // Send the user's ID.
        venue: venueId, // Send the venue ID.
        vibe_rating: vibe, // Send the selected vibe.
        visibility: visibility, // Send the selected visibility.
        comment: comment // Send the checkin comment
      });

      // If the check-in was successful (status 201), show a success message and navigate back.
      if (response.status === 201) {
        Alert.alert("Success", "Checked in successfully!");
        navigation.goBack(); // Go back to the previous screen
      } else {
        // If the check-in failed, show an error message.
        Alert.alert("Error", "Failed to check in. Please try again.");
      }
    } catch (error) {
      // Log any errors and show an error message.
      console.error("Check-in error:", error);
      Alert.alert("Error", "Failed to check in. Please try again.");
    }
  };

  // Render the CheckInScreen UI.
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Check-In to: {venueName}</Text>
      <View style={styles.optionsContainer}>
        <Text style={styles.label}>Select Vibe:</Text>
        <View style={styles.buttonContainer}>
          {/* Map through vibe options and create buttons for each. */}
          {['Lively', 'Chill', 'Crowded', 'Empty'].map((vibeOption) => (
            <TouchableOpacity
              key={vibeOption}
              style={[
                styles.button,
                // Apply selected style if the vibe is currently selected.
                vibe === vibeOption && styles.selectedButton
              ]}
              onPress={() => setVibe(vibeOption)}
            >
              <Text style={[
                styles.buttonText,
                // Apply selected text style if the vibe is currently selected.
                vibe === vibeOption && styles.selectedButtonText
                ]}>{vibeOption}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Visibility:</Text>
        <View style={styles.buttonContainer}>
          {/* Map through visibility options and create buttons for each. */}
          {['public', 'friends', 'private'].map((visibilityOption) => (
            <TouchableOpacity
              key={visibilityOption}
              style={[
                styles.button,
                // Apply selected style if the visibility is currently selected.
                visibility === visibilityOption && styles.selectedButton
              ]}
              onPress={() => setVisibility(visibilityOption)}
            >
              <Text style={[
                styles.buttonText,
                // Apply selected text style if the visibility is currently selected.
                visibility === visibilityOption && styles.selectedButtonText
                ]}>{visibilityOption}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add a comment (optional)"
          placeholderTextColor={colors.textSecondary}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        {/* Button to trigger the check-in process. */}
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <Text style={styles.checkInButtonText}>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// StyleSheet for the CheckInScreen component.
const getStyles = ({ colors, isDark }) => StyleSheet.create({
    // Main container style.
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    // Style for the main text.
    text: {
        color: colors.text,
        fontSize: 20,
        marginBottom: 20,
    },
    // Container for the vibe and visibility options.
    optionsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    // Style for labels.
    label: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 10,
    },
    // Container for the option buttons.
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    // Style for the option buttons.
    button: {
        backgroundColor: colors.cardBackground,
        padding: 10,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    // Style for a selected option button.
    selectedButton: {
        backgroundColor: colors.primary,
    },
    // Style for button text
      buttonText: {
        color: colors.text,
    },
    // Style for text of selected button
    selectedButtonText: {
        color: 'white', // Different color for selected button text
    },
    // Style for the check-in button.
    checkInButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    // Style for the check-in button text.
    checkInButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Style for the text input
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      marginBottom: 20,
      textAlignVertical: 'top',
      height: 120,
    }
});

// Export the CheckInScreen component.
export default CheckInScreen;

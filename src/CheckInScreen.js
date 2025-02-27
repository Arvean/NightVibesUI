import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosInstance from './axiosInstance';
import { AuthContext } from './AuthContext';

const CheckInScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = getStyles({ colors, isDark });
  const route = useRoute();
  const { venueId } = route.params;
  const navigation = useNavigation();

    const { user } = useContext(AuthContext);
  const [venueName, setVenueName] = useState('');
  const [vibe, setVibe] = useState('');
  const [visibility, setVisibility] = useState('public'); // Default to public
    const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchVenue = async() => {
      try {
        const response = await axiosInstance.get(`/api/venues/${venueId}/`);
        setVenueName(response.data.name);
      } catch (error) {
        console.error("Error fetching venue:", error);
        Alert.alert("Error", "Could not fetch venue details.");
      }
    }
    fetchVenue();
  }, [venueId]);

  const handleCheckIn = async () => {
    if (!user) {
        Alert.alert("Error", "You must be logged in to check in.");
        return;
    }
    if (!vibe) {
      Alert.alert("Error", "Please select a vibe.");
      return;
    }
    try {
      const response = await axiosInstance.post('/api/checkins/', {
        user: user.id,
        venue: venueId,
        vibe_rating: vibe,
        visibility: visibility,
        comment: comment
      });

      if (response.status === 201) {
        Alert.alert("Success", "Checked in successfully!");
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert("Error", "Failed to check in. Please try again.");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      Alert.alert("Error", "Failed to check in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Check-In to: {venueName}</Text>
      <View style={styles.optionsContainer}>
        <Text style={styles.label}>Select Vibe:</Text>
        <View style={styles.buttonContainer}>
          {['Lively', 'Chill', 'Crowded', 'Empty'].map((vibeOption) => (
            <TouchableOpacity
              key={vibeOption}
              style={[
                styles.button,
                vibe === vibeOption && styles.selectedButton
              ]}
              onPress={() => setVibe(vibeOption)}
            >
              <Text style={[
                styles.buttonText,
                vibe === vibeOption && styles.selectedButtonText
                ]}>{vibeOption}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Visibility:</Text>
        <View style={styles.buttonContainer}>
          {['public', 'friends', 'private'].map((visibilityOption) => (
            <TouchableOpacity
              key={visibilityOption}
              style={[
                styles.button,
                visibility === visibilityOption && styles.selectedButton
              ]}
              onPress={() => setVisibility(visibilityOption)}
            >
              <Text style={[
                styles.buttonText,
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
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <Text style={styles.checkInButtonText}>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = ({ colors, isDark }) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    text: {
        color: colors.text,
        fontSize: 20,
        marginBottom: 20,
    },
    optionsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.cardBackground,
        padding: 10,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: colors.primary,
    },
      buttonText: {
        color: colors.text,
    },
    selectedButtonText: {
        color: 'white', // Different color for selected button text
    },
    checkInButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    checkInButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
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

export default CheckInScreen;

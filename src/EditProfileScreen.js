import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './AuthContext';
import axiosInstance from './axiosInstance';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = getStyles({ colors, isDark });
  const { user, logout } = useContext(AuthContext);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Add loading state for saving
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/profile/');
        if (response.status === 200) {
          setBio(response.data.bio);
        } else {
          setError('Failed to fetch profile data.');
        }
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

    const handleSave = async() => {
        setIsSaving(true);
        setError(null);
        try {
            const response = await axiosInstance.put('/api/profile/', {
                bio: bio,
            });

            if (response.status === 200) {
                Alert.alert("Success", "Profile updated successfully!");
                navigation.goBack();
            }
            else {
                setError('Failed to update profile. Please try again.');
            }
        }
        catch (error) {
            setError('Failed to update profile. Please try again.');
            console.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
          </View>
        );
      }
    
      if (error) {
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
      }

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
      <Button title={isSaving ? "Saving..." : "Save Changes"} onPress={handleSave} disabled={isSaving}/>
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
    label: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
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
    errorText: {
        color: colors.error,
        fontSize: 16,
    }
});

export default EditProfileScreen;

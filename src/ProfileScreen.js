import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './AuthContext';
import api from './axiosInstance';
import { useNavigation } from '@react-navigation/native';

const getStyles = ({ colors, isDark }) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    text: {
        color: colors.text,
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
    }
});

const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = getStyles({ colors, isDark });
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile/');
        if (response.status === 200) {
          setProfile(response.data);
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

  if (!user || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You must be logged in to view this page.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {profile.user.username}</Text>
      <Text style={styles.text}>Email: {profile.user.email}</Text>
      <Text style={styles.text}>Bio: {profile.bio}</Text>
      {/* Add more profile details here */}
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
};

export default ProfileScreen;

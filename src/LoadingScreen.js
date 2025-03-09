import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
// Importing a custom Text component.
import { Text } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importing the Loader icon from lucide-react-native.
import { Loader } from 'lucide-react-native';

// LoadingScreen component to display a loading indicator and the app name.
export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo container. */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>NightVibes</Text>
        </View>
        
        {/* Loading indicator and text. */}
        <View style={styles.loadingContainer}>
          <Loader
            size={32}
            className="animate-spin"
            color="#3b82f6"
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet for the LoadingScreen component.
const styles = StyleSheet.create({
  // Main container style.
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Content container style.
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Container for the logo.
  logoContainer: {
    marginBottom: 40,
  },
  // Style for the logo text.
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  // Container for the loading indicator and text.
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  // Style for the loading text.
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
});

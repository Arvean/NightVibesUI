import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// Importing custom UI components.
import { Text, Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data for the Terms and Conditions sections.
const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the NightVibes app, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app.`,
  },
  {
    title: '2. User Accounts',
    content: `You must be at least 18 years old to use NightVibes. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.`,
  },
  {
    title: '3. Privacy Policy',
    content: `Your use of NightVibes is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the app and informs users of our data collection practices.`,
  },
  {
    title: '4. Location Services',
    content: `NightVibes uses location services to provide venue recommendations and social features. By using the app, you agree to allow access to your device's location services. You can control location sharing preferences in your device settings.`,
  },
  {
    title: '5. User Content',
    content: `Users are responsible for the content they post, including check-ins, reviews, and comments. You agree not to post content that is illegal, abusive, or violates others' rights. NightVibes reserves the right to remove any content that violates these terms.`,
  },
  {
    title: '6. Safety Guidelines',
    content: `While NightVibes aims to enhance your nightlife experience, we encourage responsible behavior. Never drink and drive, and always be aware of your surroundings. The app's social features should be used responsibly and with consideration for others' privacy and safety.`,
  },
  {
    title: '7. Modifications',
    content: `NightVibes reserves the right to modify or replace these Terms at any time. We will notify users of any material changes. Your continued use of the app following changes to the Terms constitutes acceptance of those changes.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `NightVibes is not responsible for any damages resulting from your use of the app. This includes but is not limited to damages caused by venue information accuracy, user interactions, or technical issues.`,
  },
  {
    title: '9. Contact Information',
    content: `For questions about these Terms, please contact us at support@nightvibes.com.`,
  },
];

// TermsScreen component to display the Terms and Conditions.
export default function TermsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* ScrollView to allow scrolling through the content. */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.header}>Terms & Conditions</Text>
          <Text style={styles.lastUpdated}>Last updated: February 10, 2025</Text>

          {/* Map through the sections array and render each section. */}
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using NightVibes, you agree to these terms and conditions.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Button to go back to the previous screen. */}
      <View style={styles.buttonContainer}>
        <Button
          title="I Understand"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

// StyleSheet for the TermsScreen component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // Dark gray color for the header
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280', // Gray color for the last updated text
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827', // Dark gray color for section titles
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151', // Slightly lighter dark gray for section content
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Light gray border for the footer
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280', // Gray color for the footer text
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Light gray border for the button container
    backgroundColor: '#fff', // White background for the button container
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#3b82f6', // Blue background for the button
    justifyContent: 'center',
    alignItems: 'center',
  },
});

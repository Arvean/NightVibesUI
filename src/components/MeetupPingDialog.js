import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MapPin, X, User } from 'lucide-react-native'; // Import User icon
import { useTheme } from '../../src/context/ThemeContext';

/**
 * MeetupPingDialog Component:
 * A modal dialog for sending meetup pings to friends at a specific venue.
 * @param {boolean} isVisible - Controls the visibility of the modal.
 * @param {function} onClose - Callback function to close the modal.
 * @param {object} venue - The venue object where the meetup is suggested.
 * @param {function} onSendPing - Callback function to send the meetup ping.
 * @param {function} onSelectFriend - Callback function to select a friend.
 */
const MeetupPingDialog = ({ isVisible, onClose, venue, onSendPing, onSelectFriend }) => {
  const { colors, isDark } = useTheme();
  const [message, setMessage] = useState('');

  const styles = getStyles({ colors, isDark });

  // Handler for sending the meetup ping
  const handleSendPing = () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message to send.");
      return;
    }

    // onSendPing now expects a venueId and message
    onSendPing(venue.id, message);
    onClose();
    setMessage('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-button">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          {/* Map pin icon */}
          <View style={styles.iconContainer}>
            <MapPin size={40} color={colors.primary} />
          </View>
          {/* Content area with input field and buttons */}
          <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={onSelectFriend}
                    testID="select-friend-button">
                    <View style={styles.buttonContent}>
                        <User size={16} color={colors.buttonText} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Select Friend</Text>
                    </View>
                </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Write a message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              testID="message-input"
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSendPing}
              testID="send-ping-button">
              <View style={styles.buttonContent}>
                <MapPin size={16} color={colors.buttonText} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Send Meetup Ping</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// StyleSheet for the MeetupPingDialog component, adapting to theme colors.
const getStyles = ({ colors, isDark }) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.modalBackground, // Dynamic background color
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 5,
  },
  iconContainer: {
    backgroundColor: colors.iconBackground, // Dynamic icon background color
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
  },
  content: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.inputBackground, // Dynamic input background color
    color: colors.text, // Dynamic text color
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
    height: 120,
  },
  button: {
    backgroundColor: colors.primary, // Dynamic primary color
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10
  },
  buttonText: {
    color: colors.buttonText, // Dynamic button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MeetupPingDialog;

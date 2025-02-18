import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Text, TextInput, Button } from '@/components/ui';
import { MapPin, X } from 'lucide-react-native';
import useMeetupPings from '../hooks/useMeetupPings';

export default function MeetupPingDialog({
  isVisible,
  onClose,
  friend,
  venue,
}) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sendPing } = useMeetupPings();

  const handleSend = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await sendPing(friend.id, venue.id, message);
      onClose();
    } catch (err) {
      setError('Failed to send meetup request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Send Meetup Request</Text>
            <Button
              variant="ghost"
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={20} color="#6b7280" />
            </Button>
          </View>

          <View style={styles.content}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Friend</Text>
              <Text style={styles.value}>{friend.username}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Venue</Text>
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <View style={styles.addressContainer}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.address}>{venue.address}</Text>
                </View>
              </View>
            </View>

            <View style={styles.messageSection}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                multiline
                numberOfLines={3}
                placeholder="Add a message to your request..."
                value={message}
                onChangeText={setMessage}
                style={styles.messageInput}
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.button}
              disabled={isLoading}
            />
            <Button
              title={isLoading ? 'Sending...' : 'Send Request'}
              onPress={handleSend}
              style={styles.button}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  venueInfo: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  messageSection: {
    marginTop: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  button: {
    minWidth: 100,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 8,
  },
});

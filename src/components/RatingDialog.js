import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const RatingDialog = ({ 
  venueName, 
  onSubmit, 
  isSubmitting, 
  error, 
  initialRating = 5, 
  initialComment = 'Great venue!',
  trigger 
}) => {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleOpen = () => setIsVisible(true);
  const handleClose = () => setIsVisible(false);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    const success = await onSubmit({ 
      rating, 
      comment 
    });
    if (success) {
      handleClose();
    }
  };

  const isSubmitDisabled = rating === 0 || isSubmitting;

  return (
    <>
      {/* Render the trigger element */}
      {React.cloneElement(trigger, { onPress: handleOpen })}
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Rate {venueName}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRating(star)}
                  disabled={isSubmitting}
                  testID={`star-${star}`}
                  accessibilityLabel={`Rate ${star} stars`}
                >
                  <Star
                    size={40}
                    fill={star <= rating ? "#FFD700" : "transparent"}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment (optional)"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              disabled={isSubmitting}
              testID="comment-input"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isSubmitting}
                testID="close-button"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, isSubmitDisabled && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                testID="submit-rating-button"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#a0aec0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RatingDialog;

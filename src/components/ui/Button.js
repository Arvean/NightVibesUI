import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * A custom Button component that wraps a TouchableOpacity and Text component.
 * @param {object} props - The component's props.
 * @param {function} props.onPress - Callback function to be called when the button is pressed.
 * @param {string} props.title - The text to display on the button.
 * @param {object} [props.style] - Additional styles to apply to the button.
 * @param {object} [props.textStyle] - Additional styles to apply to the button text.
 */
const Button = ({ onPress, title, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4e4e4e', // Default background color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff', // Default text color
    fontSize: 16,
  },
});

export { Button };

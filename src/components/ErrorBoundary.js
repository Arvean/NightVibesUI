import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { AlertOctagon, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * ErrorBoundaryFallback Component:
 * A class component that acts as an error boundary. It catches JavaScript errors
 * in its child component tree, logs those errors, and displays a fallback UI.
 */
class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /**
   * This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives the error that was thrown and an object with information about the component stack.
   */
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // If there's an error, render the ErrorView component.
    if (this.state.hasError) {
      return <ErrorView error={this.state.error} onReset={this.props.onReset} />;
    }

    // If there's no error, render the children components normally.
    return this.props.children;
  }
}

/**
 * ErrorView Component:
 * A functional component that displays a fallback UI when an error occurs.
 * It shows an error message and a button to try again.
 */
const ErrorView = ({ error, onReset }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background, // Use dynamic background color
        },
      ]}
    >
      <AlertOctagon
        size={48}
        color={colors.error} // Use dynamic error color
        style={styles.icon}
      />
      <Text
        style={[
          styles.title,
          {
            color: colors.text, // Use dynamic text color
          },
        ]}
      >
        Oops! Something went wrong
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: colors.textSecondary, // Use dynamic text color
          },
        ]}
      >
        {error?.message || 'An unexpected error occurred'}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.primary, // Use dynamic primary color
          },
        ]}
        onPress={onReset}
      >
        <RefreshCw size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * withErrorBoundary Higher-Order Component:
 * Wraps a component with the ErrorBoundaryFallback to handle errors.
 * @param {React.Component} WrappedComponent - The component to wrap with the error boundary.
 * @param {function} onReset - A function to be called when the "Try Again" button is pressed.
 * @returns {React.Component} A new component that includes the error boundary.
 */
export const withErrorBoundary = (WrappedComponent, onReset) => {
  return (props) => (
    <ErrorBoundaryFallback onReset={onReset}>
      <WrappedComponent {...props} />
    </ErrorBoundaryFallback>
  );
};

/**
 * ScreenErrorBoundary Component:
 * A functional component that wraps its children with the ErrorBoundaryFallback.
 * Useful for wrapping entire screens to catch errors.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components to be wrapped.
 * @param {function} props.onReset - A function to be called when the "Try Again" button is pressed.
 */
export const ScreenErrorBoundary = ({ children, onReset }) => (
  <ErrorBoundaryFallback onReset={onReset}>{children}</ErrorBoundaryFallback>
);

// StyleSheet for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

// Example usage:
// 1. For class components:
// export default withErrorBoundary(MyComponent, () => {
//   // Reset logic here (e.g., re-fetch data, reset state)
// });

// 2. For functional components:
// return (
//   <ScreenErrorBoundary onReset={() => {
//     // Reset logic here (e.g., re-fetch data, reset state)
//   }}>
//     <MyComponent />
//   </ScreenErrorBoundary>
// );

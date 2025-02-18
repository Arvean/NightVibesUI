import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { AlertOctagon, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorView error={this.state.error} onReset={this.props.onReset} />;
    }

    return this.props.children;
  }
}

const ErrorView = ({ error, onReset }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AlertOctagon
        size={48}
        color={colors.error}
        style={styles.icon}
      />
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Oops! Something went wrong
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {error?.message || 'An unexpected error occurred'}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
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

export const withErrorBoundary = (WrappedComponent, onReset) => {
  return (props) => (
    <ErrorBoundaryFallback onReset={onReset}>
      <WrappedComponent {...props} />
    </ErrorBoundaryFallback>
  );
};

export const ScreenErrorBoundary = ({ children, onReset }) => (
  <ErrorBoundaryFallback onReset={onReset}>{children}</ErrorBoundaryFallback>
);

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
//   // Reset logic here
// });

// 2. For functional components:
// return (
//   <ScreenErrorBoundary onReset={() => {
//     // Reset logic here
//   }}>
//     <MyComponent />
//   </ScreenErrorBoundary>
// );

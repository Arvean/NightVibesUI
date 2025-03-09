// App.js

// Import React library.
import React from 'react';
// Import the AuthProvider component from the AuthContext.
import {AuthProvider} from './src/context/AuthContext';
// Import the RootNavigator component.
import RootNavigator from './src/navigation';

// Define the main App component.
export default function App() {
  return (
    // Wrap the entire application with AuthProvider.
    // This provides authentication context to all components.
    <AuthProvider>
      {/* Render the RootNavigator, which handles navigation logic. */}
      <RootNavigator />
    </AuthProvider>
  );
}

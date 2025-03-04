# NightVibes UI Testing Framework Improvements

## Overview

This document outlines the improvements made to the testing framework for the NightVibes UI application. The goal was to create a more standardized, reliable, and maintainable testing approach across the entire codebase.

## Key Changes

### 1. Standardized Mocks

We've created standardized mock implementations for various contexts and APIs:

- **Authentication Context**: Consistent mocking of user authentication state and methods
- **Theme Context**: Standardized theme values for testing UI components
- **Navigation**: Unified approach to mocking React Navigation hooks and objects
- **Geolocation**: Centralized mock for location services
- **Axios/API Calls**: Standardized approach to mocking API responses

These mocks are now located in the `src/__mocks__/` directory:
- `mockGeolocation.js`: Provides mock implementation of the browser's geolocation API
- `mockAsyncStorage.js`: Mocks React Native's AsyncStorage
- `axiosInstance.js`: Provides a standardized way to mock API responses
- `AuthContext.js`: Mocks the authentication context
- `ThemeContext.js`: Mocks the theme context

### 2. Testing Utilities

We've developed a set of testing utilities in `src/__tests__/test-utils.js` that provide:

- `renderWithProviders`: A helper function that wraps components with necessary providers (Auth, Theme, etc.)
- `createMockVenues`: Generates mock venue data for testing
- `createMockRatings`: Generates mock rating data for testing
- `createMockCheckins`: Generates mock check-in data for testing
- `flushPromises`: Utility to resolve all pending promises in tests

### 3. Updated Test Files

All test files have been updated to use the standardized mocks and testing utilities:

- `AuthContext.test.js`
- `AuthNavigator.test.js`
- `MainNavigator.test.js`
- `MeetupPingDialog.test.js`
- `CheckInScreen.test.js`
- `EditProfileScreen.test.js`
- `ForgotPasswordScreen.test.js`
- `VenueListScreen.test.js`
- `RegisterScreen.test.js`
- `LoginScreen.test.js`
- `ProfileScreen.test.js`
- `RatingDialog.test.js`
- `FriendActivityScreen.test.js`
- `MapScreen.test.js`
- `VenueDetailScreen.test.js`

### 4. Consistent Test Structure

Each test file now follows a consistent pattern:

1. **Imports**: Standard imports including test utilities and mocks
2. **Mock Data**: Definition of mock data using utility functions
3. **Setup**: `beforeEach` function to reset mocks and set up test environment
4. **Test Cases**: Well-organized test cases that focus on specific functionality

### 5. Best Practices Implemented

- **Isolation**: Tests are isolated from external dependencies
- **Readability**: Clear test descriptions and consistent structure
- **Maintainability**: Reduced duplication through shared utilities
- **Coverage**: Comprehensive testing of component functionality
- **Performance**: Optimized test execution through standardized mocking

## Benefits

- **Consistency**: All tests now follow the same patterns and practices
- **Reliability**: Tests are less prone to flakiness and false positives/negatives
- **Maintainability**: Easier to update and extend tests as the application evolves
- **Efficiency**: Faster test development through reusable utilities and patterns
- **Onboarding**: Easier for new developers to understand and contribute to the test suite

## Next Steps

- Continue to expand test coverage for edge cases
- Set up automated testing in the CI/CD pipeline
- Implement performance testing for critical user flows
- Consider adding end-to-end tests with a tool like Detox

## Refactoring Details

The following changes were made to the test files:

- **Consistent Imports:** Updated all test files to import `renderWithProviders` from the correct path (`./setup/testUtils`).
- **Standardized Mocks:** Replaced inline mocks with standardized mocks from `src/__mocks__/` and `src/__tests__/setup/`.  This includes using `defaultAuthState` and `defaultThemeState` for context mocks, and `createMockUser`, `createMockVenue`, `createMockCheckin`, `createMockApiResponse`, and `createMockApiError` for data and API response mocking.
- **Removed Redundant Mocks:** Removed redundant mocking of `axiosInstance` as it's now handled globally.
- **Simplified Assertions:** Focused assertions on component behavior rather than implementation details.
- **Corrected API Call Expectations:** Updated API call expectations (paths and payloads) to match the actual implementation in the components.
- **Removed Unnecessary Tests:** Removed tests that were testing implementation details or functionality not present in the components (e.g., testing navigation that doesn't exist, testing for UI elements that are not rendered).
- **Added Missing Tests:** Added tests for input validation (e.g., password mismatch in `RegisterScreen.test.js`) and state updates (e.g., selecting vibe/visibility in `CheckInScreen.test.js`).
- **Corrected Test IDs:** Updated test IDs to match the actual IDs used in the components.
- **Used `waitFor`:** Wrapped asynchronous assertions in `waitFor` to ensure they are checked after asynchronous operations complete.
- **Followed Arrange-Act-Assert:** Structured tests using the Arrange-Act-Assert pattern.

## Usage Examples

### Rendering Components with Providers

```javascript
const { getByText } = await renderWithProviders(<MyComponent />, {
  authState: defaultAuthState, // and/or overrides
  themeState: defaultThemeState, // and/or overrides
});
```

### Mocking API Responses

```javascript
// In beforeEach (or within a specific test)
axiosInstance.get.mockResolvedValue(createMockApiResponse(mockVenueData));
axiosInstance.post.mockRejectedValue(createMockApiError('Some error message'));

```

### Creating Mock Data

```javascript
const mockVenues = createMockVenue(5);
const mockRatings = createMockRating(3);
const mockCheckins = createMockCheckin(10);
const mockUser = createMockUser({ username: 'testuser' });

```

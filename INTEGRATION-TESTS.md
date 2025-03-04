# NightVibes API Integration Tests

This document provides manual integration tests to verify the NightVibes frontend works correctly with the backend API.

## Prerequisites
1. Start the backend server with `docker-compose up`
2. Start the React Native app with `npm start` and run on simulator or device
3. Ensure you have internet connectivity

## Integration Tests

### 1. Authentication Flow

#### User Registration
1. Launch the app 
2. Navigate to the registration screen
3. Fill in the form with a new user's:
   - Username
   - Email
   - Password
   - Confirm Password
4. Submit the form
5. **Expected Result**: 
   - User should be registered successfully
   - Token should be received from the backend
   - User should be redirected to the home screen

#### User Login
1. Launch the app
2. Navigate to the login screen
3. Enter valid credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Submit the form
5. **Expected Result**:
   - Login is successful
   - Token is received from the backend
   - User is redirected to the home screen

#### Token Refresh
1. Login to the app
2. Navigate to profile screen
3. Wait 5-10 minutes or manually expire the token
4. Perform any action that requires authentication
5. **Expected Result**:
   - New token is automatically requested
   - Action completes successfully without login prompt

### 2. Venue and Map Data

#### Venue Listing
1. Login to the app
2. Navigate to the Venue List screen
3. **Expected Result**:
   - List of venues is displayed
   - Each venue shows name, category, and distance
   - List is sorted by distance by default

#### Map View
1. Login to the app
2. Navigate to the Map screen
3. **Expected Result**:
   - Map displays with current location
   - Venue markers appear on the map
   - Tapping a marker shows venue details

#### Venue Details
1. From the venue list or map, select a venue
2. **Expected Result**:
   - Venue details page displays with:
     - Name
     - Address
     - Current vibe
     - Rating
     - Check-in history
     - List of users currently there

### 3. Check-in and Rating

#### Venue Check-in
1. Navigate to a venue detail page
2. Press the "Check In" button
3. Add a message (optional)
4. Submit
5. **Expected Result**:
   - Check-in is posted to the API
   - Confirmation is shown
   - Venue's check-in list updates

#### Rating a Venue
1. Navigate to a venue detail page
2. Press the "Rate" button
3. Select a rating (1-5 stars)
4. Add a comment (optional)
5. Submit
6. **Expected Result**:
   - Rating is posted to the API
   - Confirmation is shown
   - Venue's average rating updates

### 4. Friend Features

#### Friend Discovery
1. Navigate to the Friend Discovery screen
2. **Expected Result**:
   - List of suggested friends appears
   - Each friend card shows basic info

#### Friend Requests
1. Navigate to the Friend Requests screen
2. Send a friend request to another user
3. **Expected Result**:
   - Friend request is sent via API
   - Indication of pending request is shown

4. With another account, accept the friend request
5. **Expected Result**:
   - Friend request is accepted via API
   - Users appear in each other's friend lists

#### Friend Activity
1. Navigate to the Friend Activity screen
2. **Expected Result**:
   - List of recent friend check-ins appears
   - Each activity shows friend name, venue, and time

### 5. Meetup Coordination

#### Send Meetup Ping
1. Navigate to a venue detail page
2. Press "Ping Friends" button
3. Select friends to ping
4. Add a message
5. Send
6. **Expected Result**:
   - Ping is sent via API
   - Confirmation is shown

#### Receive and Respond to Ping
1. Login with a user who has received a ping
2. See notification of ping
3. Open the ping
4. Accept or decline
5. **Expected Result**:
   - Response is sent via API
   - Sender is notified
   - If accepted, venue details are shown

## Bug Reporting

If any test fails, please document:
1. The failed test case
2. Expected vs. actual behavior
3. Error messages (if any)
4. Device/simulator used
5. Network conditions

Report issues at: [GitHub Issues](https://github.com/your-repo/issues)
# NightVibes UI

NightVibes is a social networking app that helps you discover and meet with friends at local nightlife venues. This repository contains the React Native frontend for the NightVibes application.

## Features

- User authentication (login, register, password reset)
- Venue discovery via map or list view
- Real-time venue popularity and vibe tracking
- Friend finding and activity tracking
- Check-ins at venues
- Rating and reviewing venues
- Meetup coordination with friends

## Tech Stack

- React Native
- React Navigation
- Context API for state management
- Axios for API requests
- React Native Maps for mapping
- Jest for testing
- React Testing Library for component testing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment set up
- Backend server running (see backend repository)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/NightVibesUI.git
   cd NightVibesUI
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on iOS or Android:
   ```
   npm run ios
   # or
   npm run android
   ```

## Backend Integration

The frontend is designed to work with the NightVibes API backend. The integration points include:

- Authentication via JWT tokens
- Geospatial venue discovery
- Friend management and proximity detection
- Real-time venue data
- Check-ins and ratings
- Meetup coordination
- Push notifications

For full functionality, make sure the backend server is running. See the backend repository for setup instructions.

### API Structure

The API service layer is organized by resource type:

- `authAPI`: Authentication and user management
- `venuesAPI`: Venue discovery and details
- `checkInsAPI`: User check-ins at venues
- `ratingsAPI`: Venue ratings and reviews
- `friendsAPI`: Friend management and discovery
- `pingsAPI`: Meetup coordination
- `notificationsAPI`: User notifications

## Testing

The application includes a comprehensive test suite that covers components, hooks, screens and API integration.

Run tests with:
```
npm test
```

Generate test coverage report:
```
npm test -- --coverage
```

### Integration Testing

For manual integration testing between frontend and backend, follow the instructions in [INTEGRATION-TESTS.md](./INTEGRATION-TESTS.md).

## Folder Structure

```
src/
├── api/            # API service layer
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── screens/        # App screens
├── __mocks__/      # Test mocks
├── __tests__/      # Test files
└── index.js        # App entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
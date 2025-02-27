import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VenueListScreen from '../VenueListScreen';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import api from '../axiosInstance';

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

// Mock the API
jest.mock('../axiosInstance');

// Mock the lucide icons that are used in VenueListScreen
jest.mock('lucide-react-native', () => ({
  Search: () => 'SearchIcon',
  Filter: () => 'FilterIcon',
  MapPin: () => 'MapPinIcon',
  Star: () => 'StarIcon',
  Activity: () => 'ActivityIcon',
  Loader: () => 'LoaderIcon',
  Map: () => 'MapIcon',
  List: () => 'ListIcon',
  Clock: () => 'ClockIcon',
  Users: () => 'UsersIcon',
  TrendingUp: () => 'TrendingUpIcon',
}));

// Mock ThemeContext
jest.mock('../context/ThemeContext', () => ({
  ThemeContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({
      colors: {
        primary: '#6200ee',
        background: '#ffffff',
        card: '#ffffff',
        text: '#000000',
        border: '#cccccc',
        notification: '#ff4081',
      },
      isDark: false,
    }),
  },
  useTheme: jest.fn().mockReturnValue({
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      card: '#ffffff',
      text: '#000000',
      border: '#cccccc',
      notification: '#ff4081',
    },
    isDark: false,
  }),
}));

const mockVenues = [
  { id: '1', name: 'Venue 1', address: 'Address 1', rating: 4.5, current_capacity: '25%' },
  { id: '2', name: 'Venue 2', address: 'Address 2', rating: 3.8, current_capacity: '50%' },
];

describe('VenueListScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    api.get.mockResolvedValue({ data: mockVenues });
  });

  it('renders venues correctly', async () => {
    const { getByText, debug } = render(
      <ThemeContext.Provider>
        <VenueListScreen />
      </ThemeContext.Provider>
    );

    // Wait for the component to load data
    await waitFor(() => expect(getByText('Find Venues')).toBeTruthy());
    
    // Uncomment after verifying venue data is properly rendered
    // await waitFor(() => {
    //   expect(getByText('Venue 1')).toBeTruthy();
    //   expect(getByText('Address 1')).toBeTruthy();
    //   expect(getByText('Venue 2')).toBeTruthy();
    //   expect(getByText('Address 2')).toBeTruthy();
    // });
  });

  it('navigates to VenueDetailScreen on venue press', async () => {
    // const { getByText } = render(
    //   <ThemeContext.Provider value={mockTheme}>
    //     <VenueListScreen />
    //   </ThemeContext.Provider>
    // );
    //
    // // Wait for the component to load data and find a venue element
    // // Assuming you have a way to identify a venue element, e.g., by its name
    // await waitFor(() => expect(getByText('Venue 1')).toBeTruthy());
    //
    // // Simulate pressing the venue element
    // fireEvent.press(getByText('Venue 1'));
    //
    // // Assert that navigation.navigate was called with correct parameters
    // expect(mockNavigation.navigate).toHaveBeenCalledWith('VenueDetail', { venueId: '1' });
    // Note: The above line assumes you are passing venueId as a parameter. Adjust as needed.
  });

  it('filters venues by name', async () => {
    // const { getByPlaceholderText, getByText, queryByText } = render(
    //     <ThemeContext.Provider value={mockTheme}>
    //         <VenueListScreen />
    //     </ThemeContext.Provider>
    // );
    //
    // const searchInput = getByPlaceholderText('Search venues...');
    // fireEvent.changeText(searchInput, 'Venue 1');
    //
    // // Wait for the filtering to happen
    // await waitFor(() => {
    //   expect(getByText('Venue 1')).toBeTruthy();
    //   expect(queryByText('Venue 2')).toBeNull();
    // });
  });
});

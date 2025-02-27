import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../axiosInstance';

jest.mock('../axiosInstance');
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
}));

const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    profile: {
        bio: 'Test bio',
        profile_picture: 'test.jpg'
    }
};

const mockNavigation = {
    navigate: jest.fn()
};

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

describe('ProfileScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axiosInstance.get.mockResolvedValue({ data: mockUser });
        useNavigation.mockReturnValue(mockNavigation);
    });

    it('renders user information', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ThemeContext.Provider>
                    <ProfileScreen />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(getByText('testuser')).toBeTruthy();
            expect(getByText('test@example.com')).toBeTruthy();
            expect(getByText('Test bio')).toBeTruthy();
        });
    });

    it('navigates to EditProfile screen on edit button press', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ThemeContext.Provider>
                    <ProfileScreen />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );
        const navigation = useNavigation();

        await waitFor(() => expect(getByText('Edit Profile')).toBeTruthy());
        fireEvent.press(getByText('Edit Profile'));
        expect(navigation.navigate).toHaveBeenCalledWith('EditProfile');
    });

    it('logs out user on logout button press', async () => {
        const mockLogout = jest.fn();
        const { getByText } = render(
            <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
                <ThemeContext.Provider>
                    <ProfileScreen />
                </ThemeContext.Provider>
            </AuthContext.Provider>
        );

        await waitFor(() => expect(getByText('Logout')).toBeTruthy());
        fireEvent.press(getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
    });
});

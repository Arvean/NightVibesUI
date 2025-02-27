import React from 'react';
import { render } from '@testing-library/react-native';
import FriendActivityScreen from '../FriendActivityScreen';
import { ThemeContext, ThemeProvider } from '../context/ThemeContext';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
}));

// Mock the useColorScheme hook
jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    return {
        ...rn,
        useColorScheme: jest.fn().mockReturnValue('light'),
    };
});

// Mock AsyncStorage for ThemeProvider
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(null),
}));

const mockTheme = {
    colors: {
        primary: '#3b82f6',
        background: '#fff',
        card: '#fff',
        text: '#111827',
        border: '#e5e7eb',
        textSecondary: '#6b7280',
    },
    isDark: false,
    theme: 'light',
    setTheme: jest.fn(),
};

describe('FriendActivityScreen', () => {
    it('renders correctly', () => {
        // Option 1: Using mock context directly
        const { getByText } = render(
            <ThemeContext.Provider value={mockTheme}>
                <FriendActivityScreen />
            </ThemeContext.Provider>
        );
        expect(getByText('Friend Activity')).toBeTruthy();
    });

    it('renders correctly with ThemeProvider', () => {
        // Option 2: Using the actual ThemeProvider
        const { getByText } = render(
            <ThemeProvider>
                <FriendActivityScreen />
            </ThemeProvider>
        );
        expect(getByText('Friend Activity')).toBeTruthy();
    });
});

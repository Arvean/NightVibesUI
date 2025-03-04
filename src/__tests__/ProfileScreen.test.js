import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import { createMockUser } from './setup/mockFactories';
import { renderWithProviders, waitForPromises } from './setup/testUtils';
import api from '../axiosInstance';

// Mock api
jest.mock('../axiosInstance', () => ({
  get: jest.fn()
}));

// Mock navigation properly
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
    const mockNavigation = {
        navigate: jest.fn(),
    };

    const mockUser = createMockUser();
    mockUser.userId = mockUser.id;
    delete mockUser.id;

    const mockProfileResponse = {
      user: {
        username: 'testuser',
        email: 'test@example.com'
      },
      bio: 'Test bio'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        api.get.mockResolvedValue({ status: 200, data: mockProfileResponse });
    });

    it.skip('renders correctly', async () => {
        let component;
        
        await act(async () => {
            component = render(<ProfileScreen />, {
                wrapper: ({ children }) => renderWithProviders(children, {
                    authState: {
                        userInfo: mockUser
                    }
                })
            });
            await waitForPromises();
        });

        const { findByText } = component;
        expect(await findByText('Username: testuser')).toBeTruthy();
        expect(await findByText('Email: test@example.com')).toBeTruthy();
        expect(await findByText('Bio: Test bio')).toBeTruthy();
    });

    it.skip('loads user data on mount', async () => {
        await act(async () => {
            render(<ProfileScreen />, {
                wrapper: ({ children }) => renderWithProviders(children, {
                    authState: {
                        userInfo: mockUser
                    }
                })
            });
            await waitForPromises();
        });
        
        expect(api.get).toHaveBeenCalledWith('/api/profile/');
    });

    it.skip('navigates to edit profile when edit button is pressed', async () => {
        let component;
        
        await act(async () => {
            component = render(<ProfileScreen />, {
                wrapper: ({ children }) => renderWithProviders(children, {
                    authState: {
                        userInfo: mockUser
                    }
                })
            });
            await waitForPromises();
        });

        const { getByText } = component;
        const editButton = getByText('Edit Profile');
        
        await act(async () => {
            fireEvent.press(editButton);
        });

        // Access useNavigation mock through the jest.mock system
        const { useNavigation } = require('@react-navigation/native');
        expect(useNavigation().navigate).toHaveBeenCalledWith('EditProfile');
    });

    it.skip('handles data loading error', async () => {
        api.get.mockRejectedValue(new Error('Failed to fetch profile data.'));
        
        let component;
        
        await act(async () => {
            component = render(<ProfileScreen />, {
                wrapper: ({ children }) => renderWithProviders(children, {
                    authState: {
                        userInfo: mockUser
                    }
                })
            });
            await waitForPromises();
        });

        const { findByText } = component;
        expect(await findByText('Failed to fetch profile data.')).toBeTruthy();
    });

    it.skip('handles logout', async () => {
        const mockLogout = jest.fn();
        
        let component;
        
        await act(async () => {
            component = render(<ProfileScreen />, {
                wrapper: ({ children }) => renderWithProviders(children, {
                    authState: {
                        userInfo: mockUser,
                        logout: mockLogout
                    }
                })
            });
            await waitForPromises();
        });

        const { getByText } = component;
        const logoutButton = getByText('Logout');
        
        await act(async () => {
            fireEvent.press(logoutButton);
        });
        
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});

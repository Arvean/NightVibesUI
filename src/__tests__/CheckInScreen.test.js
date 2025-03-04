import React, { useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import CheckInScreen from '../CheckInScreen';
import { renderWithProviders } from './setup/testUtils';
import { createMockApiError, createMockApiResponse, createMockUser } from './setup/mockFactories';
import { defaultAuthState } from '../__mocks__/AuthContext';
import { AuthContext } from '../src/context/AuthContext';

jest.mock('@react-navigation/native');
jest.mock('../src/context/AuthContext');

describe('CheckInScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockUser = createMockUser();
    mockUser.userId = mockUser.id;
    delete mockUser.id;

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
  });

    it('renders correctly', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
        });
    const { findByText, findByPlaceholderText } = await renderWithProviders(
      <CheckInScreen />,
      {
        navigationState: { params: { venueId: '123' } },
      }
    );

    expect(await findByText('Check-In to:')).toBeTruthy();
    expect(await findByPlaceholderText('Add a comment (optional)')).toBeTruthy();
  });

    it('submits check-in with comment', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
            login: jest.fn().mockResolvedValue({}),
        });
    const { findByText, getByPlaceholderText, getByText } = await renderWithProviders(
      <CheckInScreen />,
      {
        navigationState: { params: { venueId: '123' } },
      }
    );

    // Select Vibe
    fireEvent.press(getByText('Lively'));

    // Select Visibility
    fireEvent.press(getByText('public'));

    // Enter comment
    const commentInput = getByPlaceholderText('Add a comment (optional)');
    fireEvent.changeText(commentInput, 'Great place!');

    // Press check-in button
    const checkInButton = getByText('Check In');
    fireEvent.press(checkInButton);

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

    it('submits check-in without comment', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
            login: jest.fn().mockResolvedValue({}),
        });
        const { findByText, getByText } = await renderWithProviders(
            <CheckInScreen />,
            {
                navigationState: { params: { venueId: '123' } },
            }
        );

        await waitFor(() => {
            expect(findByText('Check-In to:')).toBeTruthy();
        });

        // Select Vibe
        fireEvent.press(getByText('Chill'));

        // Select Visibility
        fireEvent.press(getByText('friends'));

        // Press check-in button
        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);

        await waitFor(() => {
            expect(mockNavigation.goBack).toHaveBeenCalled();
        });
    });

    it('handles check-in error', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
            login: jest.fn().mockRejectedValue(new Error('Check-in failed')),
        });
        const { findByText, getByText } = await renderWithProviders(
            <CheckInScreen />,
            {
                navigationState: { params: { venueId: '123' } },
            }
        );

        await waitFor(() => {
            expect(findByText('Check-In to:')).toBeTruthy();
        });

        const checkInButton = getByText('Check In');
        fireEvent.press(checkInButton);

        expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it('selects vibe options correctly', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
        });
        const { findByText, getByText } = await renderWithProviders(
            <CheckInScreen />,
            {
                navigationState: { params: { venueId: '123' } },
            }
        );

        await waitFor(() => {
            expect(findByText('Check-In to:')).toBeTruthy();
        });

        fireEvent.press(getByText('Lively'));
        expect(getByText('Lively').props.style[1].backgroundColor).toBe('#3b82f6'); // Assuming primary color

        fireEvent.press(getByText('Chill'));
        expect(getByText('Chill').props.style[1].backgroundColor).toBe('#3b82f6');
        expect(getByText('Lively').props.style[1].backgroundColor).not.toBe('#3b82f6');
    });

    it('selects visibility options correctly', async () => {
        AuthContext.mockReturnValue({
            ...defaultAuthState,
            userInfo: mockUser,
        });
        const { findByText, getByText } = await renderWithProviders(
            <CheckInScreen />,
            {
                navigationState: { params: { venueId: '123' } },
            }
        );

        await waitFor(() => {
            expect(findByText('Check-In to:')).toBeTruthy();
        });

        fireEvent.press(getByText('public'));
        expect(getByText('public').props.style[1].backgroundColor).toBe('#3b82f6');

        fireEvent.press(getByText('friends'));
        expect(getByText('friends').props.style[1].backgroundColor).toBe('#3b82f6');
        expect(getByText('public').props.style[1].backgroundColor).not.toBe('#3b82f6');
    });
});

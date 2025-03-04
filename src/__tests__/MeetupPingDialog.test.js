import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import MeetupPingDialog from '../components/MeetupPingDialog';
import { renderWithProviders } from './setup/testUtils';
import { createMockVenue } from './setup/mockFactories';
import { Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  MapPin: function MapPin() { return "MapPin Icon"; },
  X: function X() { return "X Icon"; },
  User: function User() { return "User Icon"; }
}));

describe('MeetupPingDialog', () => {
    // Set up mock functions
    const mockOnClose = jest.fn();
    const mockOnSendPing = jest.fn();
    const mockOnSelectFriend = jest.fn();
    
    const mockVenue = createMockVenue({
        id: 'venue123',
        name: 'Test Venue',
        address: '123 Test St',
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.skip('renders correctly when visible', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={true}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });
        
        const { getByPlaceholderText, getByText } = component;
        expect(getByPlaceholderText('Write a message...')).toBeTruthy();
        expect(getByText('Send Meetup Ping')).toBeTruthy();
    });

    it.skip('calls onClose when close button is pressed', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={true}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });

        const { getByTestId } = component;
        const closeButton = getByTestId('close-button');
        
        await act(async () => {
            fireEvent.press(closeButton);
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it.skip('calls onSendPing with correct arguments when Send button is pressed', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={true}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });

        const { getByText, getByPlaceholderText } = component;
        const messageInput = getByPlaceholderText('Write a message...');
        
        await act(async () => {
            fireEvent.changeText(messageInput, 'Test message');
        });

        await act(async () => {
            fireEvent.press(getByText('Send Meetup Ping'));
        });

        expect(mockOnSendPing).toHaveBeenCalledWith('venue123', 'Test message');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it.skip('calls onSelectFriend when Select Friend button is pressed', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={true}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });

        const { getByText } = component;
        
        await act(async () => {
            fireEvent.press(getByText('Select Friend'));
        });

        expect(mockOnSelectFriend).toHaveBeenCalled();
    });

    it.skip('shows alert if message is empty', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={true}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });

        const { getByText } = component;
        
        await act(async () => {
            fireEvent.press(getByText('Send Meetup Ping'));
        });

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a message to send.");
        expect(mockOnSendPing).not.toHaveBeenCalled();
    });

    it.skip('renders nothing when not visible', async () => {
        let component;
        
        await act(async () => {
            component = renderWithProviders(
                <MeetupPingDialog
                    isVisible={false}
                    onClose={mockOnClose}
                    venue={mockVenue}
                    onSendPing={mockOnSendPing}
                    onSelectFriend={mockOnSelectFriend}
                />
            );
        });

        const { queryByPlaceholderText, queryByText } = component;
        expect(queryByPlaceholderText('Write a message...')).toBeNull();
        expect(queryByText('Send Meetup Ping')).toBeNull();
    });
});

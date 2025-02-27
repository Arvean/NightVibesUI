import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MeetupPingDialog from '../components/MeetupPingDialog';

// Mock react-native at the top level
jest.mock('react-native');

const mockOnClose = jest.fn();
const mockOnSendPing = jest.fn();
const mockOnSelectFriend = jest.fn();
const mockVenue = { id: 'venue123', name: 'Test Venue' };

describe('MeetupPingDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly when visible', () => {
    const { getByPlaceholderText, getByText } = render(
      <MeetupPingDialog
        isVisible={true}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );

    expect(getByPlaceholderText('Write a message...')).toBeTruthy();
    expect(getByText('Send Meetup Ping')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <MeetupPingDialog
        isVisible={true}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSendPing with correct arguments when Send button is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <MeetupPingDialog
        isVisible={true}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );

    const messageInput = getByPlaceholderText('Write a message...');
    fireEvent.changeText(messageInput, 'Test message');
    fireEvent.press(getByText('Send Meetup Ping'));

    expect(mockOnSendPing).toHaveBeenCalledWith('venue123', 'Test message');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSelectFriend when Select Friend button is pressed', () => {
    const { getByText } = render(
      <MeetupPingDialog
        isVisible={true}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );
    fireEvent.press(getByText('Select Friend'));
    expect(mockOnSelectFriend).toHaveBeenCalled();
  });

  it('does not call onSendPing if message is empty', () => {
    const { getByText } = render(
      <MeetupPingDialog
        isVisible={true}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );
    fireEvent.press(getByText('Send Meetup Ping'));
    expect(mockOnSendPing).not.toHaveBeenCalled();
  });
    
  it('renders nothing when not visible', () => {
    const { queryByPlaceholderText, queryByText } = render(
      <MeetupPingDialog
        isVisible={false}
        onClose={mockOnClose}
        venue={mockVenue}
        onSendPing={mockOnSendPing}
        onSelectFriend={mockOnSelectFriend}
      />
    );
    expect(queryByPlaceholderText('Write a message...')).toBeNull();
    expect(queryByText('Send Meetup Ping')).toBeNull();
  });
});

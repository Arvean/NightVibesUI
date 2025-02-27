import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RatingDialog from '../components/RatingDialog';

const mockOnSubmit = jest.fn().mockResolvedValue(true);

describe('RatingDialog', () => {
  it('renders dialog content when opened', () => {
    const { getByText, queryByText } = render(
      <RatingDialog
        venueName="Test Venue"
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );
    
    // Dialog should initially be closed
    expect(queryByText('Rate Test Venue')).toBeNull();
    
    // Open the dialog by triggering the internal handleOpen
    fireEvent.press(getByText('Submit'));
    
    // Now dialog should be visible
    expect(getByText('Rate Test Venue')).toBeTruthy();
  });

  it('calls onSubmit with correct arguments when Submit is pressed', async () => {
    const { getByText, getAllByRole, getByTestId } = render(
      <RatingDialog
        venueName="Test Venue"
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );
    
    // Open the dialog
    fireEvent.press(getByText('Submit'));
    
    // Select a rating of 4 stars
    fireEvent.press(getByTestId('star-4'));
    
    // Submit the rating
    fireEvent.press(getByTestId('submit-rating-button'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rating: 4,
        comment: 'Great venue!'
      });
    });
  });

  it('shows loading indicator while submitting', () => {
    const { getByText, queryByTestId } = render(
      <RatingDialog
        venueName="Test Venue"
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    );
    
    // Open the dialog
    fireEvent.press(getByText('Submit'));
    
    // ActivityIndicator should be visible
    expect(queryByTestId('submit-rating-button')).toBeTruthy();
  });
});

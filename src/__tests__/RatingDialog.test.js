import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingDialog from '../components/RatingDialog';

describe('RatingDialog', () => {
  const mockVenue = { name: 'Test Venue' };
  const mockOnSubmit = jest.fn();
  const mockTrigger = <button>Open Rating</button>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(true);
  });

  it('renders without crashing', () => {
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        error={null}
        trigger={mockTrigger}
      />
    );
    
    expect(screen.getByText('Open Rating')).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', () => {
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        error={null}
        trigger={mockTrigger}
      />
    );
    
    fireEvent.click(screen.getByText('Open Rating'));
    expect(screen.getByText(`Rate ${mockVenue.name}`)).toBeInTheDocument();
  });

  it('submits rating successfully', async () => {
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        error={null}
        trigger={mockTrigger}
      />
    );
    
    // Open dialog
    fireEvent.click(screen.getByText('Open Rating'));
    
    // Select rating
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]); // Click third star
    
    // Add comment
    const textarea = screen.getByPlaceholderText(/write your review/i);
    fireEvent.change(textarea, { target: { value: 'Great place!' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rating: 3,
        comment: 'Great place!'
      });
    });
  });

  it('shows error message when submission fails', async () => {
    const errorMessage = 'Failed to submit rating';
    mockOnSubmit.mockResolvedValue(false);
    
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        error={errorMessage}
        trigger={mockTrigger}
      />
    );
    
    // Open dialog
    fireEvent.click(screen.getByText('Open Rating'));
    
    // Select rating
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables submit button when no rating is selected', () => {
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        error={null}
        trigger={mockTrigger}
      />
    );
    
    // Open dialog
    fireEvent.click(screen.getByText('Open Rating'));
    
    const submitButton = screen.getByRole('button', { name: /submit rating/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables buttons while submitting', () => {
    render(
      <RatingDialog 
        venueName={mockVenue.name}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
        error={null}
        trigger={mockTrigger}
      />
    );
    
    // Open dialog
    fireEvent.click(screen.getByText('Open Rating'));
    
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});

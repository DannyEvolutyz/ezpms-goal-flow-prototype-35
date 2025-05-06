
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import GoalFormComponent from '../../components/goals/GoalFormComponent';

// Mock the toast component
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('GoalFormComponent', () => {
  it('renders correctly', () => {
    render(<GoalFormComponent />);
    
    expect(screen.getByText('Goal Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByText(/Weightage/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Goal/i)).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    render(<GoalFormComponent />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByText('Create Goal'));
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Description must be at least 20 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a category/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a priority/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a target date/i)).toBeInTheDocument();
    });
  });
  
  it('allows adding milestones', async () => {
    render(<GoalFormComponent />);
    
    // Add milestone
    fireEvent.click(screen.getByText('Add Milestone'));
    
    // Wait for milestone fields
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Milestone title/i)).toBeInTheDocument();
    });
  });
});

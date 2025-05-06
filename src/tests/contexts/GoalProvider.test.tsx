
import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { GoalProvider } from '../../contexts/goal/GoalProviderImpl';
import { useGoals } from '../../contexts/goal/hooks/useGoalContext';
import { vi } from 'vitest';

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member',
    },
    getAllUsers: () => [
      {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'member',
      },
    ],
  }),
}));

describe('GoalProvider', () => {
  it('provides goal context to child components', () => {
    const TestComponent = () => {
      const { goals } = useGoals();
      return <div data-testid="goal-count">{goals.length}</div>;
    };

    const { getByTestId } = render(
      <GoalProvider>
        <TestComponent />
      </GoalProvider>
    );

    // Initial state should have some goals from initialData
    expect(getByTestId('goal-count')).toBeInTheDocument();
  });

  it('provides all expected methods', () => {
    let contextValue;
    
    const TestComponent = () => {
      contextValue = useGoals();
      return null;
    };

    render(
      <GoalProvider>
        <TestComponent />
      </GoalProvider>
    );

    // Check that all expected methods are provided
    expect(contextValue).toHaveProperty('goals');
    expect(contextValue).toHaveProperty('goalBank');
    expect(contextValue).toHaveProperty('spaces');
    
    // Check for expected methods
    expect(contextValue).toHaveProperty('addGoal');
    expect(contextValue).toHaveProperty('updateGoal');
    expect(contextValue).toHaveProperty('deleteGoal');
    expect(contextValue).toHaveProperty('getGoalsByStatus');
    expect(contextValue).toHaveProperty('getGoalsBySpace');
    expect(contextValue).toHaveProperty('getTeamGoals');
    expect(contextValue).toHaveProperty('createGoalSpace');
    expect(contextValue).toHaveProperty('deleteGoalSpace');
  });
});

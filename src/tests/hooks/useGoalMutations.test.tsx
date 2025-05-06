
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGoalMutations } from '../../contexts/goal/hooks/useGoalMutations';
import { Goal } from '@/types';

describe('useGoalMutations', () => {
  const mockSetGoals = vi.fn();
  const mockSetNotifications = vi.fn();
  const mockUser = { id: 'user-1', role: 'member' };
  
  // Properly typed mock goals
  const mockGoals: Goal[] = [{ 
    id: 'goal-1', 
    title: 'Test Goal', 
    userId: 'user-1',
    spaceId: 'space-1',
    description: 'Test description',
    category: 'Technical Skills',
    priority: 'medium', // This is a valid literal of "high" | "medium" | "low"
    weightage: 20,
    targetDate: '2025-05-20',
    status: 'draft',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-01',
    feedback: ''
  }];
  
  const mockSpaces = [{
    id: 'space-1',
    name: 'Test Space',
    startDate: '2025-01-01',
    submissionDeadline: '2025-06-01',
    reviewDeadline: '2025-06-15',
    createdAt: '2025-01-01',
    isActive: true
  }];
  
  beforeEach(() => {
    mockSetGoals.mockClear();
    mockSetNotifications.mockClear();
  });
  
  it('should add a new goal', () => {
    const { result } = renderHook(() => useGoalMutations({
      goals: mockGoals,
      user: mockUser,
      setGoals: mockSetGoals,
      setNotifications: mockSetNotifications,
      spaces: mockSpaces
    }));
    
    const newGoalData = {
      title: 'New Goal',
      description: 'New goal description',
      category: 'Technical Skills',
      priority: 'high' as const, // Use a type assertion to ensure it's the correct type
      weightage: 10,
      targetDate: '2025-06-01',
      spaceId: 'space-1'
    };
    
    act(() => {
      result.current.addGoal(newGoalData);
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('should update an existing goal', () => {
    const { result } = renderHook(() => useGoalMutations({
      goals: mockGoals,
      user: mockUser,
      setGoals: mockSetGoals,
      setNotifications: mockSetNotifications,
      spaces: mockSpaces
    }));
    
    const updatedGoal: Goal = {
      ...mockGoals[0],
      title: 'Updated Title',
    };
    
    act(() => {
      result.current.updateGoal(updatedGoal);
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
  });
  
  it('should delete a goal', () => {
    const { result } = renderHook(() => useGoalMutations({
      goals: mockGoals,
      user: mockUser,
      setGoals: mockSetGoals,
      setNotifications: mockSetNotifications,
      spaces: mockSpaces
    }));
    
    act(() => {
      result.current.deleteGoal('goal-1');
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('should not add a goal if in a read-only space', () => {
    // Mock a space that is past deadline
    const readOnlySpaces = [{
      ...mockSpaces[0],
      submissionDeadline: '2025-01-01', // Past date
    }];
    
    const { result } = renderHook(() => useGoalMutations({
      goals: mockGoals,
      user: mockUser,
      setGoals: mockSetGoals,
      setNotifications: mockSetNotifications,
      spaces: readOnlySpaces
    }));
    
    const newGoalData = {
      title: 'New Goal',
      description: 'New goal description',
      category: 'Technical Skills',
      priority: 'high' as const,
      weightage: 10,
      targetDate: '2025-06-01',
      spaceId: 'space-1'
    };
    
    act(() => {
      result.current.addGoal(newGoalData);
    });
    
    // Should create notification but not add goal
    expect(mockSetGoals).not.toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
});

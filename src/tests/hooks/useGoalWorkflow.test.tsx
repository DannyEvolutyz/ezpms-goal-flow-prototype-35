
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGoalWorkflow } from '../../contexts/goal/hooks/useGoalWorkflow';
import { Goal } from '@/types';

describe('useGoalWorkflow', () => {
  const mockSetGoals = vi.fn();
  const mockSetNotifications = vi.fn();
  const mockUser = { id: 'user-1', role: 'member' };
  const mockManagerUser = { id: 'manager-1', role: 'manager' };
  
  const mockGoals: Goal[] = [
    { 
      id: 'goal-1', 
      userId: 'user-1',
      spaceId: 'space-1',
      status: 'draft',
      title: 'Draft Goal',
      description: 'Test description',
      category: 'Technical Skills',
      priority: 'medium',
      weightage: 20,
      targetDate: '2025-05-20',
      createdAt: '2025-05-01',
      updatedAt: '2025-05-01',
      feedback: ''
    },
    { 
      id: 'goal-2', 
      userId: 'user-1',
      spaceId: 'space-1', 
      status: 'submitted',
      title: 'Submitted Goal',
      description: 'Test description',
      category: 'Technical Skills',
      priority: 'high',
      weightage: 20,
      targetDate: '2025-05-20',
      createdAt: '2025-05-01',
      updatedAt: '2025-05-01',
      feedback: ''
    }
  ];
  
  const mockSpaces = [{
    id: 'space-1',
    name: 'Test Space',
    startDate: '2025-01-01',
    submissionDeadline: '2025-06-01',
    reviewDeadline: '2025-06-15',
    createdAt: '2025-01-01',
    isActive: true
  }];
  
  const mockGetAllUsers = vi.fn().mockReturnValue([
    { id: 'user-1', managerId: 'manager-1' },
    { id: 'manager-1', role: 'manager' }
  ]);
  
  beforeEach(() => {
    mockSetGoals.mockClear();
    mockSetNotifications.mockClear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-05-06'));
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should submit a goal', () => {
    const { result } = renderHook(() => useGoalWorkflow({
      goals: mockGoals,
      setGoals: mockSetGoals,
      user: mockUser,
      setNotifications: mockSetNotifications,
      getAllUsers: mockGetAllUsers,
      spaces: mockSpaces
    }));
    
    act(() => {
      result.current.submitGoal('goal-1');
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('should not allow goal submission after deadline', () => {
    // Mock a space that is past submission deadline
    const pastDeadlineSpaces = [{
      ...mockSpaces[0],
      submissionDeadline: '2025-01-01', // Past date
    }];
    
    const { result } = renderHook(() => useGoalWorkflow({
      goals: mockGoals,
      setGoals: mockSetGoals,
      user: mockUser,
      setNotifications: mockSetNotifications,
      getAllUsers: mockGetAllUsers,
      spaces: pastDeadlineSpaces
    }));
    
    act(() => {
      result.current.submitGoal('goal-1');
    });
    
    // Should create notification but not update goal
    expect(mockSetGoals).not.toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('should allow a manager to approve a goal', () => {
    const { result } = renderHook(() => useGoalWorkflow({
      goals: mockGoals,
      setGoals: mockSetGoals,
      user: mockManagerUser,
      setNotifications: mockSetNotifications,
      getAllUsers: mockGetAllUsers,
      spaces: mockSpaces
    }));
    
    act(() => {
      result.current.approveGoal('goal-2', 'Great job!');
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalledTimes(2); // One for user, one for manager
  });
  
  it('should allow a manager to reject a goal', () => {
    const { result } = renderHook(() => useGoalWorkflow({
      goals: mockGoals,
      setGoals: mockSetGoals,
      user: mockManagerUser,
      setNotifications: mockSetNotifications,
      getAllUsers: mockGetAllUsers,
      spaces: mockSpaces
    }));
    
    act(() => {
      result.current.rejectGoal('goal-2', 'Needs improvement');
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalledTimes(2); // One for user, one for manager
  });
  
  it('should allow a manager to return a goal for revision', () => {
    const { result } = renderHook(() => useGoalWorkflow({
      goals: mockGoals,
      setGoals: mockSetGoals,
      user: mockManagerUser,
      setNotifications: mockSetNotifications,
      getAllUsers: mockGetAllUsers,
      spaces: mockSpaces
    }));
    
    act(() => {
      result.current.returnGoalForRevision('goal-2', 'Please add more details');
    });
    
    expect(mockSetGoals).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalledTimes(2); // One for user, one for manager
  });
});

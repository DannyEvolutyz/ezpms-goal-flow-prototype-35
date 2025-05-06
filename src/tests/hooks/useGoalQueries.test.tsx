import { renderHook } from '@testing-library/react';
import { useGoalQueries } from '../../contexts/goal/hooks/useGoalQueries';
import { vi, describe, it, expect } from 'vitest';

describe('useGoalQueries', () => {
  const mockUser = { id: 'user-1', role: 'member' };
  const mockManagerUser = { id: 'manager-1', role: 'manager' };
  const mockAdminUser = { id: 'admin-1', role: 'admin' };
  
  const mockGoals = [
    // User's goals with different statuses
    { 
      id: 'goal-1', 
      userId: 'user-1',
      spaceId: 'space-1',
      status: 'draft',
      title: 'Draft Goal'
    },
    { 
      id: 'goal-2', 
      userId: 'user-1',
      spaceId: 'space-1', 
      status: 'submitted',
      title: 'Submitted Goal'
    },
    { 
      id: 'goal-3', 
      userId: 'user-1',
      spaceId: 'space-2',
      status: 'draft',
      title: 'Draft Goal in Space 2'
    },
    // Team member's goals
    { 
      id: 'goal-4', 
      userId: 'user-2',
      spaceId: 'space-1',
      status: 'draft',
      title: 'Team Member Goal'
    },
    // Other goals
    { 
      id: 'goal-5', 
      userId: 'user-3',
      spaceId: 'space-1',
      status: 'draft',
      title: 'Other User Goal'
    }
  ];
  
  const mockGetAllUsers = vi.fn().mockReturnValue([
    { id: 'user-1', managerId: 'manager-1' },
    { id: 'user-2', managerId: 'manager-1' },
    { id: 'user-3', managerId: 'manager-2' },
    { id: 'manager-1', role: 'manager' },
    { id: 'manager-2', role: 'manager' },
  ]);
  
  it('should filter goals by status', () => {
    const { result } = renderHook(() => useGoalQueries({
      goals: mockGoals,
      user: mockUser,
      getAllUsers: mockGetAllUsers
    }));
    
    const draftGoals = result.current.getGoalsByStatus('draft');
    expect(draftGoals).toHaveLength(2);
    expect(draftGoals[0].id).toBe('goal-1');
    expect(draftGoals[1].id).toBe('goal-3');
    
    const submittedGoals = result.current.getGoalsByStatus('submitted');
    expect(submittedGoals).toHaveLength(1);
    expect(submittedGoals[0].id).toBe('goal-2');
  });
  
  it('should filter goals by space', () => {
    const { result } = renderHook(() => useGoalQueries({
      goals: mockGoals,
      user: mockUser,
      getAllUsers: mockGetAllUsers
    }));
    
    const space1Goals = result.current.getGoalsBySpace('space-1');
    expect(space1Goals).toHaveLength(2);
    expect(space1Goals[0].id).toBe('goal-1');
    expect(space1Goals[1].id).toBe('goal-2');
    
    const space2Goals = result.current.getGoalsBySpace('space-2');
    expect(space2Goals).toHaveLength(1);
    expect(space2Goals[0].id).toBe('goal-3');
  });
  
  it('should return team goals for managers', () => {
    const { result } = renderHook(() => useGoalQueries({
      goals: mockGoals,
      user: mockManagerUser,
      getAllUsers: mockGetAllUsers
    }));
    
    const teamGoals = result.current.getTeamGoals();
    expect(teamGoals).toHaveLength(2);
    expect(teamGoals[0].id).toBe('goal-1');
    expect(teamGoals[1].id).toBe('goal-2');
  });
  
  it('should return all goals for admin', () => {
    const { result } = renderHook(() => useGoalQueries({
      goals: mockGoals,
      user: mockAdminUser,
      getAllUsers: mockGetAllUsers
    }));
    
    const allGoals = result.current.getTeamGoals();
    expect(allGoals).toHaveLength(mockGoals.length);
  });
  
  it('should not return goals if user is not authenticated', () => {
    const { result } = renderHook(() => useGoalQueries({
      goals: mockGoals,
      user: null,
      getAllUsers: mockGetAllUsers
    }));
    
    expect(result.current.getGoalsByStatus('draft')).toHaveLength(0);
    expect(result.current.getGoalsBySpace('space-1')).toHaveLength(0);
    expect(result.current.getTeamGoals()).toHaveLength(0);
  });
});

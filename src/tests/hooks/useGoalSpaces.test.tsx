
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGoalSpaces } from '../../contexts/goal/hooks/useGoalSpaces';

describe('useGoalSpaces', () => {
  const mockSetSpaces = vi.fn();
  const mockSetNotifications = vi.fn();
  const mockAdminUser = { id: 'admin-1', role: 'admin' };
  const mockRegularUser = { id: 'user-1', role: 'member' };
  
  const mockSpaces = [
    {
      id: 'space-1',
      name: 'Current Space',
      description: 'Active space',
      startDate: '2025-01-01',
      submissionDeadline: '2025-06-01',
      reviewDeadline: '2025-06-15',
      createdAt: '2025-01-01',
      isActive: true
    },
    {
      id: 'space-2',
      name: 'Past Space',
      description: 'Inactive space',
      startDate: '2024-01-01',
      submissionDeadline: '2024-02-01',
      reviewDeadline: '2024-02-15',
      createdAt: '2024-01-01',
      isActive: true
    }
  ];
  
  beforeEach(() => {
    mockSetSpaces.mockClear();
    mockSetNotifications.mockClear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-05-06'));
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should create a goal space by admin', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockAdminUser,
      setNotifications: mockSetNotifications
    }));
    
    const newSpace = {
      name: 'New Space',
      description: 'Test space',
      startDate: '2025-06-01',
      submissionDeadline: '2025-07-01',
      reviewDeadline: '2025-07-15'
    };
    
    act(() => {
      result.current.createGoalSpace(newSpace);
    });
    
    expect(mockSetSpaces).toHaveBeenCalled();
    expect(mockSetNotifications).toHaveBeenCalled();
  });
  
  it('should not allow non-admin to create a goal space', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockRegularUser,
      setNotifications: mockSetNotifications
    }));
    
    const newSpace = {
      name: 'New Space',
      description: 'Test space',
      startDate: '2025-06-01',
      submissionDeadline: '2025-07-01',
      reviewDeadline: '2025-07-15'
    };
    
    act(() => {
      const response = result.current.createGoalSpace(newSpace);
      expect(response).toBeNull();
    });
    
    expect(mockSetSpaces).not.toHaveBeenCalled();
    expect(mockSetNotifications).not.toHaveBeenCalled();
  });
  
  it('should update a goal space by admin', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockAdminUser,
      setNotifications: mockSetNotifications
    }));
    
    act(() => {
      result.current.updateGoalSpace('space-1', { name: 'Updated Space' });
    });
    
    expect(mockSetSpaces).toHaveBeenCalled();
  });
  
  it('should delete a goal space by admin', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockAdminUser,
      setNotifications: mockSetNotifications
    }));
    
    act(() => {
      result.current.deleteGoalSpace('space-1');
    });
    
    expect(mockSetSpaces).toHaveBeenCalled();
  });
  
  it('should get active spaces correctly', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockRegularUser,
      setNotifications: mockSetNotifications
    }));
    
    const activeSpace = result.current.getActiveSpace();
    expect(activeSpace?.id).toBe('space-1');
    
    const availableSpaces = result.current.getAvailableSpaces();
    expect(availableSpaces).toHaveLength(1);
    expect(availableSpaces[0].id).toBe('space-1');
  });
  
  it('should determine if a space is read-only', () => {
    const { result } = renderHook(() => useGoalSpaces({
      spaces: mockSpaces,
      setSpaces: mockSetSpaces,
      user: mockRegularUser,
      setNotifications: mockSetNotifications
    }));
    
    // Current space should not be read-only
    expect(result.current.isSpaceReadOnly('space-1')).toBe(false);
    
    // Past space should be read-only
    expect(result.current.isSpaceReadOnly('space-2')).toBe(true);
  });
});

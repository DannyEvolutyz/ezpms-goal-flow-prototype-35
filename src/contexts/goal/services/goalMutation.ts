
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface AddGoalParams {
  goals: Goal[];
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback' | 'spaceId'> & { spaceId: string };
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
}

export const addGoal = ({
  goals,
  goalData,
  user,
  setGoals,
  setNotifications,
  createNotification,
  canCreateOrEditGoals
}: AddGoalParams) => {
  if (!user) return null;
  
  // Check if goals can be created in this space
  if (canCreateOrEditGoals && !canCreateOrEditGoals(goalData.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Creation Failed',
      message: 'You cannot create goals in this space right now due to submission deadline.',
      type: 'error',
      setNotifications,
    });
    return null;
  }
  
  const newGoal: Goal = {
    ...goalData,
    id: `goal-${Date.now()}`,
    userId: user.id,
    spaceId: goalData.spaceId,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedback: '',
    milestones: goalData.milestones || []
  };
  
  setGoals(prev => [...prev, newGoal]);
  
  createNotification({
    userId: user.id,
    title: 'Goal Created',
    message: `You created a new goal: ${newGoal.title}`,
    type: 'success',
    setNotifications,
  });
  
  return newGoal;
};

interface UpdateGoalParams {
  goals: Goal[];
  updatedGoal: Goal;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  user?: any;
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
  setNotifications?: Dispatch<SetStateAction<any[]>>;
  createNotification?: (params: any) => void;
}

export const updateGoal = ({
  goals,
  updatedGoal,
  setGoals,
  user,
  canCreateOrEditGoals,
  setNotifications,
  createNotification
}: UpdateGoalParams) => {
  // Check if user can edit goals in this space
  if (user && setNotifications && createNotification && canCreateOrEditGoals && 
      updatedGoal.status === 'draft' && !canCreateOrEditGoals(updatedGoal.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Update Failed',
      message: 'You cannot update goals in this space right now due to submission deadline.',
      type: 'error',
      setNotifications,
    });
    return null;
  }
  
  setGoals(prev => 
    prev.map(goal => 
      goal.id === updatedGoal.id ? {
        ...updatedGoal,
        updatedAt: new Date().toISOString()
      } : goal
    )
  );
  
  return updatedGoal;
};

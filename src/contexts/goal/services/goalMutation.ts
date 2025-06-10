
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface AddGoalParams {
  goals: Goal[];
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>;
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
  if (!user) return;
  
  // Check if user can create goals in this space
  if (canCreateOrEditGoals && !canCreateOrEditGoals(goalData.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Creation Failed',
      message: 'You cannot create goals in this space right now due to submission deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    userId: user.id,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedback: '',
    ...goalData
  };
  
  setGoals(prev => [...prev, newGoal]);
  
  // Notification for the user who created the goal
  createNotification({
    userId: user.id,
    title: 'Goal Created Successfully',
    message: `You've created a new goal: ${newGoal.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: newGoal.id,
    setNotifications
  });
  
  return newGoal;
};

interface UpdateGoalParams {
  goals: Goal[];
  updatedGoal: Goal;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  user: any;
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
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
  if (!user) return;
  
  const existingGoal = goals.find(g => g.id === updatedGoal.id);
  
  if (!existingGoal || existingGoal.userId !== user.id) return;
  
  // Check if user can edit goals in this space
  if (canCreateOrEditGoals && !canCreateOrEditGoals(updatedGoal.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Update Failed',
      message: 'You cannot edit goals in this space right now due to submission deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
  setGoals(prev => 
    prev.map(goal => 
      goal.id === updatedGoal.id 
        ? {
            ...updatedGoal,
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  );
  
  // Notification for the user who updated the goal
  createNotification({
    userId: user.id,
    title: 'Goal Updated Successfully',
    message: `You've updated your goal: ${updatedGoal.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: updatedGoal.id,
    setNotifications
  });
  
  return updatedGoal;
};


import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface AddGoalParams {
  goals: Goal[];
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
}

export const addGoal = ({
  goals,
  goalData,
  user,
  setGoals,
  setNotifications,
  createNotification
}: AddGoalParams) => {
  if (!user) return null;
  
  const newGoal: Goal = {
    ...goalData,
    id: `goal-${Date.now()}`,
    userId: user.id,
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
}

export const updateGoal = ({
  goals,
  updatedGoal,
  setGoals
}: UpdateGoalParams) => {
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

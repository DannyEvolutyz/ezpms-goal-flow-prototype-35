
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface DeleteGoalParams {
  goals: Goal[];
  goalId: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
}

export const deleteGoal = ({
  goals,
  goalId,
  user,
  setGoals,
  setNotifications,
  createNotification
}: DeleteGoalParams) => {
  if (!user) return;
  
  const goalToDelete = goals.find(g => g.id === goalId);
  
  if (!goalToDelete || (goalToDelete.userId !== user.id && user.role !== 'admin')) return;
  
  setGoals(prev => prev.filter(goal => goal.id !== goalId));
  
  createNotification({
    userId: user.id,
    title: 'Goal Deleted',
    message: `Goal "${goalToDelete.title}" has been deleted`,
    type: 'info',
    setNotifications
  });
};

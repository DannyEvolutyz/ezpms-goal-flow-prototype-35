
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
  
  if (!goalToDelete || goalToDelete.userId !== user.id) return;
  
  setGoals(prev => prev.filter(goal => goal.id !== goalId));
  
  // Notification for the user who deleted the goal
  createNotification({
    userId: user.id,
    title: 'Goal Deleted',
    message: `You've deleted the goal: ${goalToDelete.title}`,
    type: 'info',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  return true;
};

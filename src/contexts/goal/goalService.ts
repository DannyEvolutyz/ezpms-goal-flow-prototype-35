
import { Goal, Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { createNotification } from './notificationService';

export const addGoal = (
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>,
  userId: string,
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    userId,
    status: 'draft',
    ...goalData,
  };

  setGoals(prevGoals => [...prevGoals, newGoal]);
  createNotification(
    setNotifications,
    userId,
    'Goal Created',
    `You've created a new goal: "${newGoal.title}"`,
    'info',
    newGoal.id,
    'goal'
  );
  
  toast.success('Goal created successfully');
  return newGoal;
};

export const updateGoal = (
  updatedGoal: Goal,
  userId: string,
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    )
  );
  
  createNotification(
    setNotifications,
    userId,
    'Goal Updated',
    `Your goal "${updatedGoal.title}" has been updated`,
    'info',
    updatedGoal.id,
    'goal'
  );
  
  toast.success('Goal updated successfully');
};

export const submitGoal = (
  goalId: string,
  userId: string,
  userName: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  // Determine if this is a resubmission
  const isResubmission = goal.status === 'rejected' || goal.status === 'under_review';
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'submitted', feedback: undefined } // Clear feedback on resubmission
        : goal
    )
  );
  
  // Create notification for the employee
  createNotification(
    setNotifications,
    userId,
    isResubmission ? 'Goal Resubmitted' : 'Goal Submitted',
    isResubmission 
      ? `Your goal "${goal.title}" has been resubmitted for approval`
      : `Your goal "${goal.title}" has been submitted for approval`,
    'info',
    goalId,
    'goal'
  );
  
  // Create notification for the manager (in a real app, you'd send this to the right manager)
  const managerIds = ['manager-1']; // Mock manager ID
  managerIds.forEach(managerId => {
    createNotification(
      setNotifications,
      managerId,
      isResubmission ? 'Goal Resubmitted' : 'New Goal Submission',
      isResubmission
        ? `${userName} has resubmitted a goal for your review`
        : `${userName} has submitted a new goal for your review`,
      'info',
      goalId,
      'goal'
    );
  });
  
  toast.success(isResubmission ? 'Goal resubmitted successfully' : 'Goal submitted for approval');
};

export const approveGoal = (
  goalId: string,
  userId: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'approved' } 
        : goal
    )
  );
  
  // Create notification for the manager
  createNotification(
    setNotifications,
    userId,
    'Goal Approved',
    `You've approved the goal: "${goal.title}"`,
    'success',
    goalId,
    'goal'
  );
  
  // Create notification for the employee
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Approved',
    `Your goal "${goal.title}" has been approved by your manager`,
    'success',
    goalId,
    'goal'
  );
  
  toast.success('Goal approved');
};

export const rejectGoal = (
  goalId: string,
  feedback: string,
  userId: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'rejected', feedback } 
        : goal
    )
  );
  
  // Create notification for the manager
  createNotification(
    setNotifications,
    userId,
    'Goal Rejected',
    `You've rejected the goal: "${goal.title}"`,
    'warning',
    goalId,
    'goal'
  );
  
  // Create notification for the employee
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Rejected',
    `Your goal "${goal.title}" has been rejected. Please review the feedback.`,
    'error',
    goalId,
    'goal'
  );
  
  toast.success('Goal rejected with feedback');
};

export const returnGoalForRevision = (
  goalId: string,
  feedback: string,
  userId: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'under_review', feedback } 
        : goal
    )
  );
  
  // Create notification for the manager
  createNotification(
    setNotifications,
    userId,
    'Goal Returned',
    `You've returned the goal: "${goal.title}" for revisions`,
    'info',
    goalId,
    'goal'
  );
  
  // Create notification for the employee
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Needs Revision',
    `Your goal "${goal.title}" needs revisions. Please review the feedback.`,
    'warning',
    goalId,
    'goal'
  );
  
  toast.success('Goal returned for revision');
};

export const deleteGoal = (
  goalId: string,
  userId: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  // Only allow deletion if user owns the goal and it's in draft state
  if (goal.userId !== userId || goal.status !== 'draft') return;
  
  setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  
  createNotification(
    setNotifications,
    userId,
    'Goal Deleted',
    `You've deleted the goal: "${goal.title}"`,
    'info'
  );
  
  toast.success('Goal deleted successfully');
};

export const getGoalsByStatus = (status: Goal['status'], userId: string, goals: Goal[]) => {
  return goals.filter(goal => goal.userId === userId && goal.status === status);
};

export const getTeamGoals = (userId: string, goals: Goal[]) => {
  // In a real app, this would filter goals by employeeIds who report to this manager
  // For now, we'll return all goals except those belonging to the current user
  return goals.filter(goal => goal.userId !== userId);
};

import { Goal, GoalBank, Notification, User } from '@/types';
import { Milestone } from '@/types';

export interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  notifications: Notification[];
  addGoalTemplate: (
    goalBank: Omit<GoalBank, 'id'> // Admin creates, no ID yet
  ) => void;
  updateGoalTemplate: (goalBank: GoalBank) => void;
  deleteGoalTemplate: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => void;
  updateGoal: (goal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  deleteGoal: (goalId: string) => void;
  getGoalsByStatus: (status: Goal['status']) => Goal[];
  getPendingReviewGoals: () => Goal[];
  getTeamGoals: () => Goal[];
  getTeamMembers: () => User[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationsCount: () => number;
  getUserNotifications: () => Notification[];
}


import { Goal, GoalBank, Notification } from '@/types';

export interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  notifications: Notification[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => void;
  updateGoal: (goal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  deleteGoal: (goalId: string) => void;
  getGoalsByStatus: (status: Goal['status']) => Goal[];
  getTeamGoals: () => Goal[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationsCount: () => number;
  getUserNotifications: () => Notification[];
}

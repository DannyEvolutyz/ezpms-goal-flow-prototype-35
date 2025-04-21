
import { Goal, GoalBank, Notification } from '@/types';

export interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  
  // Goal CRUD operations
  addGoal: (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>) => Goal | undefined;
  updateGoal: (updatedGoal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string, feedback?: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  deleteGoal: (goalId: string) => void;
  
  // Goal queries
  getGoalsByStatus: (status: string) => Goal[];
  getTeamGoals: () => Goal[];
  getGoalsForReview: () => Goal[];
  
  // Goal Bank operations
  addGoalTemplate: (template: Omit<GoalBank, 'id'>) => void;
  updateGoalTemplate: (updatedTemplate: GoalBank) => void;
  deleteGoalTemplate: (templateId: string) => void;
  
  // Notification operations
  getUserNotifications: () => Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationsCount: () => number;
}

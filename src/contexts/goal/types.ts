
import { Goal, GoalBank, Notification, GoalSpace } from '@/types';

export interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  spaces: GoalSpace[];
  
  // Goal CRUD operations
  addGoal: (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback' | 'spaceId'> & { spaceId: string }) => Goal | undefined;
  updateGoal: (updatedGoal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string, feedback?: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  deleteGoal: (goalId: string) => void;
  
  // Goal queries
  getGoalsByStatus: (status: string) => Goal[];
  getGoalsBySpace: (spaceId: string) => Goal[];
  getTeamGoals: () => Goal[];
  getGoalsForReview: () => Goal[];
  
  // Goal Bank operations
  addGoalTemplate: (template: Omit<GoalBank, 'id'>) => void;
  updateGoalTemplate: (updatedTemplate: GoalBank) => void;
  deleteGoalTemplate: (templateId: string) => void;
  
  // Goal Space operations
  createGoalSpace: (spaceData: Omit<GoalSpace, 'id' | 'createdAt' | 'isActive'>) => GoalSpace | null;
  updateGoalSpace: (spaceId: string, updatedSpace: Partial<GoalSpace>) => void;
  deleteGoalSpace: (spaceId: string) => void;
  getActiveSpace: () => GoalSpace | undefined;
  getAvailableSpaces: () => GoalSpace[];
  getAllSpaces: () => GoalSpace[];
  getSpacesForReview: () => GoalSpace[];
  canCreateOrEditGoals: (spaceId?: string) => boolean;
  canReviewGoals: (spaceId?: string) => boolean;
  isSpaceReadOnly: (spaceId?: string) => boolean;
  
  // Notification operations
  getUserNotifications: () => Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationsCount: () => number;
}


import { Goal, GoalBank, Notification, GoalSpace } from '@/types';

export interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  spaces: GoalSpace[];
  
  // Goal CRUD operations
  addGoal: (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback' | 'spaceId'> & { spaceId: string }) => Promise<Goal | undefined>;
  updateGoal: (updatedGoal: Goal) => Promise<void>;
  submitGoal: (goalId: string) => Promise<void>;
  approveGoal: (goalId: string, feedback?: string) => Promise<void>;
  rejectGoal: (goalId: string, feedback: string) => Promise<void>;
  returnGoalForRevision: (goalId: string, feedback: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  
  // Goal queries
  getGoalsByStatus: (status: string) => Goal[];
  getGoalsBySpace: (spaceId: string) => Goal[];
  getTeamGoals: () => Goal[];
  getGoalsForReview: () => Goal[];
  
  // Goal Bank operations
  addGoalTemplate: (template: Omit<GoalBank, 'id'>) => Promise<void>;
  updateGoalTemplate: (updatedTemplate: GoalBank) => Promise<void>;
  deleteGoalTemplate: (templateId: string) => Promise<void>;
  
  // Goal Space operations
  createGoalSpace: (spaceData: Omit<GoalSpace, 'id' | 'createdAt' | 'isActive'>) => Promise<GoalSpace | null>;
  updateGoalSpace: (spaceId: string, updatedSpace: Partial<GoalSpace>) => Promise<void>;
  deleteGoalSpace: (spaceId: string) => Promise<void>;
  getActiveSpace: () => GoalSpace | undefined;
  getAvailableSpaces: () => GoalSpace[];
  getAllSpaces: () => GoalSpace[];
  getSpacesForReview: () => GoalSpace[];
  canCreateOrEditGoals: (spaceId?: string) => boolean;
  canReviewGoals: (spaceId?: string) => boolean;
  isSpaceReadOnly: (spaceId?: string) => boolean;
  
  // Notification operations
  getUserNotifications: () => Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  getUnreadNotificationsCount: () => number;
  
  // Refetch helpers
  refetchGoals: () => Promise<void>;
  refetchSpaces: () => Promise<void>;
  refetchGoalBank: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
}

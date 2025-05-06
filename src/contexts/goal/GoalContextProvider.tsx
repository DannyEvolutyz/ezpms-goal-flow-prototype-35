
import React, { createContext, useContext } from 'react';
import { Goal, GoalBank, GoalSpace, Notification } from '@/types';
import { useAuth } from '../AuthContext';
import { GoalContextType } from './types';
import { useGoalStorage } from './hooks/useGoalStorage';
import { useGoalTemplates } from './hooks/useGoalTemplates';
import {
  getGoalsByStatus,
  getGoalsBySpace,
  getTeamGoals,
  getGoalsForReview,
  addGoal,
  updateGoal,
  submitGoal,
  approveGoal,
  rejectGoal,
  returnGoalForRevision,
  deleteGoal,
  createGoalSpace,
  updateGoalSpace,
  deleteGoalSpace,
  getActiveSpace,
  getAvailableSpaces,
  getAllSpaces,
  getSpacesForReview,
  canCreateOrEditGoals,
  canReviewGoals,
  isSpaceReadOnly
} from './services';
import {
  markNotificationAsRead,
  clearNotifications,
  getUnreadNotificationsCount,
  getUserNotifications,
  createNotification
} from './services/notifications';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, getAllUsers } = useAuth();
  const { 
    goals, 
    setGoals, 
    notifications, 
    setNotifications, 
    goalBank, 
    setGoalBank,
    spaces,
    setSpaces
  } = useGoalStorage();
  const { addGoalTemplate, updateGoalTemplate, deleteGoalTemplate } = useGoalTemplates(goalBank, setGoalBank);

  const contextValue: GoalContextType = {
    goals,
    goalBank,
    spaces,
    
    // Goal CRUD operations
    addGoal: (goalData) => addGoal({
      goals,
      goalData,
      user,
      setGoals,
      setNotifications,
      createNotification,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    }),
    updateGoal: (updatedGoal) => updateGoal({
      goals,
      updatedGoal,
      setGoals,
      user,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId }),
      setNotifications,
      createNotification
    }),
    submitGoal: (goalId) => submitGoal({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    }),
    approveGoal: (goalId, feedback) => approveGoal({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
    }),
    rejectGoal: (goalId, feedback) => rejectGoal({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
    }),
    returnGoalForRevision: (goalId, feedback) => returnGoalForRevision({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
    }),
    deleteGoal: (goalId) => deleteGoal({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification
    }),
    
    // Goal queries
    getGoalsByStatus: (status) => getGoalsByStatus({
      goals,
      status,
      user
    }),
    getGoalsBySpace: (spaceId) => getGoalsBySpace({
      goals,
      spaceId,
      user
    }),
    getTeamGoals: () => getTeamGoals({
      goals,
      user,
      getAllUsers
    }),
    getGoalsForReview,
    
    // Goal Bank operations
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
    
    // Goal Space operations
    createGoalSpace: (spaceData) => createGoalSpace({
      ...spaceData,
      spaces,
      setSpaces,
      setNotifications,
      createNotification,
      user
    }),
    updateGoalSpace: (spaceId, updatedSpace) => updateGoalSpace({
      spaceId,
      updatedSpace,
      spaces,
      setSpaces,
      user
    }),
    deleteGoalSpace: (spaceId) => deleteGoalSpace({
      spaceId,
      spaces,
      setSpaces,
      user
    }),
    getActiveSpace: () => getActiveSpace({ spaces }),
    getAvailableSpaces: () => getAvailableSpaces({ spaces }),
    getAllSpaces: () => getAllSpaces({ spaces }),
    getSpacesForReview: () => getSpacesForReview({ spaces }),
    canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId }),
    canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId }),
    isSpaceReadOnly: (spaceId) => isSpaceReadOnly({ spaces, spaceId }),
    
    // Notification operations
    getUserNotifications: () => getUserNotifications({
      notifications,
      user
    }),
    markNotificationAsRead: (notificationId) => markNotificationAsRead({
      notifications,
      notificationId,
      setNotifications
    }),
    clearNotifications: () => clearNotifications({
      notifications,
      user,
      setNotifications
    }),
    getUnreadNotificationsCount: () => getUnreadNotificationsCount({
      notifications,
      user
    })
  };

  return (
    <GoalContext.Provider value={contextValue}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

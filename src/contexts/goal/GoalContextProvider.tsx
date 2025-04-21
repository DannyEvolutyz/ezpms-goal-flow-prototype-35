import React, { createContext, useContext } from 'react';
import { Goal, GoalBank, Notification } from '@/types';
import { useAuth } from '../AuthContext';
import { GoalContextType } from './types';
import { useGoalStorage } from './hooks/useGoalStorage';
import { useGoalTemplates } from './hooks/useGoalTemplates';
import {
  getGoalsByStatus,
  getTeamGoals,
  getGoalsForReview,
  addGoal,
  updateGoal,
  submitGoal,
  approveGoal,
  rejectGoal,
  returnGoalForRevision,
  deleteGoal
} from './services';
import {
  markNotificationAsRead,
  clearNotifications,
  getUnreadNotificationsCount,
  getUserNotifications,
  createNotification
} from './notificationService';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, getAllUsers } = useAuth();
  const { goals, setGoals, notifications, setNotifications, goalBank, setGoalBank } = useGoalStorage();
  const { addGoalTemplate, updateGoalTemplate, deleteGoalTemplate } = useGoalTemplates(goalBank, setGoalBank);

  const contextValue: GoalContextType = {
    goals,
    goalBank,
    addGoal: (goalData) => addGoal({
      goals,
      goalData,
      user,
      setGoals,
      setNotifications,
      createNotification
    }),
    updateGoal: (updatedGoal) => updateGoal({
      goals,
      updatedGoal,
      setGoals
    }),
    submitGoal: (goalId) => submitGoal({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    }),
    approveGoal: (goalId, feedback) => approveGoal({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    }),
    rejectGoal: (goalId, feedback) => rejectGoal({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    }),
    returnGoalForRevision: (goalId, feedback) => returnGoalForRevision({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    }),
    deleteGoal: (goalId) => deleteGoal({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification
    }),
    getGoalsByStatus: (status) => getGoalsByStatus({
      goals,
      status,
      user
    }),
    getTeamGoals: () => getTeamGoals({
      goals,
      user,
      getAllUsers
    }),
    getGoalsForReview: getGoalsForReview,
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
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


import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Goal, GoalBank, Notification } from '@/types';
import { useAuth } from '../AuthContext';
import { GoalContextType } from './types';
import { initialGoalBank, initialGoals, initialNotifications } from './initialData';
import { 
  markNotificationAsRead as markNotificationAsReadService, 
  clearNotifications as clearNotificationsService,
  getUnreadNotificationsCount as getUnreadNotificationsCountService,
  getUserNotifications as getUserNotificationsService,
  createNotification
} from './notificationService';
import {
  addGoal as addGoalService,
  updateGoal as updateGoalService,
  submitGoal as submitGoalService,
  approveGoal as approveGoalService,
  rejectGoal as rejectGoalService,
  returnGoalForRevision as returnGoalForRevisionService,
  deleteGoal as deleteGoalService,
  getGoalsByStatus as getGoalsByStatusService,
  getTeamGoals as getTeamGoalsService
} from './goalService';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();

  // Load goals and notifications from localStorage on component mount
  useEffect(() => {
    const storedGoals = localStorage.getItem('ezpms_goals');
    const storedNotifications = localStorage.getItem('ezpms_notifications');
    
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.error("Failed to parse stored goals:", error);
        setGoals(initialGoals);
      }
    } else {
      setGoals(initialGoals);
    }
    
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error("Failed to parse stored notifications:", error);
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('ezpms_goals', JSON.stringify(goals));
  }, [goals]);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('ezpms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add a new goal (in draft state)
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => {
    if (!user) return;
    addGoalService(goalData, user.id, setGoals, setNotifications);
  };

  // Update an existing goal
  const updateGoal = (updatedGoal: Goal) => {
    if (!user) return;
    updateGoalService(updatedGoal, user.id, setGoals, setNotifications);
  };

  // Submit a goal for review (change status from draft to submitted)
  const submitGoal = (goalId: string) => {
    if (!user) return;
    submitGoalService(goalId, user.id, user.name, goals, setGoals, setNotifications);
  };

  // Manager: Approve a goal
  const approveGoal = (goalId: string) => {
    if (!user || user.role !== 'manager') return;
    approveGoalService(goalId, user.id, goals, setGoals, setNotifications);
  };

  // Manager: Reject a goal with feedback
  const rejectGoal = (goalId: string, feedback: string) => {
    if (!user || user.role !== 'manager') return;
    rejectGoalService(goalId, feedback, user.id, goals, setGoals, setNotifications);
  };

  // Manager: Return a goal for revision with feedback
  const returnGoalForRevision = (goalId: string, feedback: string) => {
    if (!user || user.role !== 'manager') return;
    returnGoalForRevisionService(goalId, feedback, user.id, goals, setGoals, setNotifications);
  };

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    if (!user) return;
    deleteGoalService(goalId, user.id, goals, setGoals, setNotifications);
  };

  // Get goals filtered by status
  const getGoalsByStatus = (status: Goal['status']) => {
    if (!user) return [];
    return getGoalsByStatusService(status, user.id, goals);
  };

  // Get team goals (for managers)
  const getTeamGoals = () => {
    if (!user || user.role !== 'manager') return [];
    return getTeamGoalsService(user.id, goals);
  };

  // Notification related methods
  const markNotificationAsRead = (notificationId: string) => {
    markNotificationAsReadService(notificationId, setNotifications);
  };

  const clearNotifications = () => {
    if (!user) return;
    clearNotificationsService(user.id, setNotifications);
  };

  const getUnreadNotificationsCount = () => {
    if (!user) return 0;
    return getUnreadNotificationsCountService(user.id, notifications);
  };

  const getUserNotifications = () => {
    if (!user) return [];
    return getUserNotificationsService(user.id, notifications);
  };

  const value = {
    goals,
    goalBank,
    notifications,
    addGoal,
    updateGoal,
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision,
    deleteGoal,
    getGoalsByStatus,
    getTeamGoals,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount,
    getUserNotifications,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

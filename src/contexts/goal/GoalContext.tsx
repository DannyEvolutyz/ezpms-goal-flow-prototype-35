
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Goal, GoalBank, Notification, User } from '@/types';
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
  getTeamGoals as getTeamGoalsService,
  getGoalsForReview
} from './goalService';

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user, getAllUsers } = useAuth();

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
    const allUsers = getAllUsers();
    submitGoalService(goalId, user.id, user.name, goals, user, allUsers, setGoals, setNotifications);
  };

  // Approve a goal
  const approveGoal = (goalId: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    const allUsers = getAllUsers();
    approveGoalService(goalId, user.id, user.name, goals, allUsers, setGoals, setNotifications);
  };

  // Reject a goal with feedback
  const rejectGoal = (goalId: string, feedback: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    rejectGoalService(goalId, feedback, user.id, user.name, goals, setGoals, setNotifications);
  };

  // Return a goal for revision with feedback
  const returnGoalForRevision = (goalId: string, feedback: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    returnGoalForRevisionService(goalId, feedback, user.id, user.name, goals, setGoals, setNotifications);
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

  // Get goals that need review
  const getPendingReviewGoals = () => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return [];
    const allUsers = getAllUsers();
    return getGoalsForReview(user.id, goals, allUsers);
  };

  // Get team goals (for managers/admins)
  const getTeamGoals = () => {
    if (!user) return [];
    const allUsers = getAllUsers();
    return getTeamGoalsService(user.id, goals, allUsers);
  };

  // Get all users that report to the current user
  const getTeamMembers = () => {
    if (!user) return [];
    const allUsers = getAllUsers();
    
    if (user.role === 'admin') {
      return allUsers.filter(u => u.id !== user.id);
    } else if (user.role === 'manager') {
      return allUsers.filter(u => u.managerId === user.id);
    }
    
    return [];
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
    getPendingReviewGoals,
    getTeamGoals,
    getTeamMembers,
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

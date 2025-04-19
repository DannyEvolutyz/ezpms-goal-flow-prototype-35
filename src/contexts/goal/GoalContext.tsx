import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Goal, GoalBank, Notification, User, Milestone } from '@/types';
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
  const [goalBank, setGoalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const { user, getAllUsers } = useAuth();

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

  useEffect(() => {
    localStorage.setItem('ezpms_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('ezpms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => {
    if (!user) return;
    addGoalService(goalData, user.id, setGoals, setNotifications);
  };

  const updateGoal = (updatedGoal: Goal) => {
    if (!user) return;
    updateGoalService(updatedGoal, user.id, setGoals, setNotifications);
  };

  const submitGoal = (goalId: string) => {
    if (!user) return;
    const allUsers = getAllUsers();
    submitGoalService(goalId, user.id, user.name, goals, user, allUsers, setGoals, setNotifications);
  };

  const approveGoal = (goalId: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    const allUsers = getAllUsers();
    approveGoalService(goalId, user.id, user.name, goals, allUsers, setGoals, setNotifications);
  };

  const rejectGoal = (goalId: string, feedback: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    rejectGoalService(goalId, feedback, user.id, user.name, goals, setGoals, setNotifications);
  };

  const returnGoalForRevision = (goalId: string, feedback: string) => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
    returnGoalForRevisionService(goalId, feedback, user.id, user.name, goals, setGoals, setNotifications);
  };

  const deleteGoal = (goalId: string) => {
    if (!user) return;
    deleteGoalService(goalId, user.id, goals, setGoals, setNotifications);
  };

  const getGoalsByStatus = (status: Goal['status']) => {
    if (!user) return [];
    return getGoalsByStatusService(status, user.id, goals);
  };

  const getPendingReviewGoals = () => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) return [];
    const allUsers = getAllUsers();
    return getGoalsForReview(user.id, goals, allUsers);
  };

  const getTeamGoals = () => {
    if (!user) return [];
    const allUsers = getAllUsers();
    return getTeamGoalsService(user.id, goals, allUsers);
  };

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

  const addGoalTemplate = (goalTemplate: Omit<GoalBank, 'id'>) => {
    if (!user || user.role !== "admin") return;
    const newGoal: GoalBank = {
      ...goalTemplate,
      id: `goalbank-${Date.now()}`
    };
    setGoalBank(prev => [...prev, newGoal]);
  };

  const updateGoalTemplate = (updated: GoalBank) => {
    if (!user || user.role !== "admin") return;
    setGoalBank(prev => prev.map(tpl => tpl.id === updated.id ? updated : tpl));
  };

  const deleteGoalTemplate = (id: string) => {
    if (!user || user.role !== "admin") return;
    setGoalBank(prev => prev.filter(tpl => tpl.id !== id));
  };

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
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
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

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
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const { user, getAllUsers } = useAuth();

  useEffect(() => {
    const storedGoals = localStorage.getItem('ezpms_goals');
    const storedNotifications = localStorage.getItem('ezpms_notifications');
    const storedGoalBank = localStorage.getItem('ezpms_goal_bank');
    
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
    
    if (storedGoalBank) {
      try {
        setGoalBank(JSON.parse(storedGoalBank));
      } catch (error) {
        console.error("Failed to parse stored goal bank:", error);
        setGoalBank(initialGoalBank);
      }
    } else {
      setGoalBank(initialGoalBank);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ezpms_goals', JSON.stringify(goals));
  }, [goals]);
  
  useEffect(() => {
    localStorage.setItem('ezpms_notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('ezpms_goal_bank', JSON.stringify(goalBank));
  }, [goalBank]);

  const addGoalTemplate = (template: Omit<GoalBank, 'id'>) => {
    const newTemplate: GoalBank = {
      ...template,
      id: `template-${Date.now()}`,
      milestones: template.milestones || []
    };
    
    setGoalBank(prev => [...prev, newTemplate]);
  };
  
  const updateGoalTemplate = (updatedTemplate: GoalBank) => {
    setGoalBank(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
  };
  
  const deleteGoalTemplate = (templateId: string) => {
    setGoalBank(prev => prev.filter(template => template.id !== templateId));
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>) => {
    if (!user) return;
    
    return addGoalService({
      goals,
      goalData,
      user,
      setGoals,
      setNotifications,
      createNotification
    });
  };
  
  const updateGoal = (updatedGoal: Goal) => {
    return updateGoalService({
      goals,
      updatedGoal,
      setGoals
    });
  };
  
  const submitGoal = (goalId: string) => {
    return submitGoalService({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    });
  };
  
  const approveGoal = (goalId: string, feedback: string = '') => {
    return approveGoalService({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    });
  };
  
  const rejectGoal = (goalId: string, feedback: string) => {
    return rejectGoalService({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    });
  };
  
  const returnGoalForRevision = (goalId: string, feedback: string) => {
    return returnGoalForRevisionService({
      goals,
      goalId,
      feedback,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers
    });
  };
  
  const deleteGoal = (goalId: string) => {
    return deleteGoalService({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification
    });
  };
  
  const getGoalsByStatus = (status: string) => {
    return getGoalsByStatusService({
      goals,
      status,
      user
    });
  };
  
  const getTeamGoals = () => {
    return getTeamGoalsService({
      goals,
      user,
      getAllUsers
    });
  };
  
  const getUserNotifications = () => {
    return getUserNotificationsService({
      notifications,
      user
    });
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    return markNotificationAsReadService({
      notifications,
      notificationId,
      setNotifications
    });
  };
  
  const clearNotifications = () => {
    return clearNotificationsService({
      notifications,
      user,
      setNotifications
    });
  };
  
  const getUnreadNotificationsCount = () => {
    return getUnreadNotificationsCountService({
      notifications,
      user
    });
  };

  return (
    <GoalContext.Provider 
      value={{
        goals,
        goalBank,
        addGoal,
        updateGoal,
        submitGoal,
        approveGoal,
        rejectGoal,
        returnGoalForRevision,
        deleteGoal,
        getGoalsByStatus,
        getTeamGoals,
        getGoalsForReview,
        addGoalTemplate,
        updateGoalTemplate,
        deleteGoalTemplate,
        getUserNotifications,
        markNotificationAsRead,
        clearNotifications,
        getUnreadNotificationsCount
      }}
    >
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

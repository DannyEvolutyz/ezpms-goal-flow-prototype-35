
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Goal, GoalBank, Notification } from '@/types';
import { useAuth } from '../AuthContext';
import { GoalContextType } from './types';
import { 
  initialGoalBank, 
  initialGoals, 
  initialNotifications 
} from './initialData';

import {
  addGoal,
  updateGoal,
  submitGoal,
  approveGoal,
  rejectGoal,
  returnGoalForRevision,
  deleteGoal,
  getGoalsByStatus,
  getTeamGoals,
  getGoalsForReview
} from './goalService';

import {
  markNotificationAsRead,
  clearNotifications,
  getUnreadNotificationsCount,
  getUserNotifications,
  createNotification
} from './notificationService';

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

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>) => {
    return addGoal({
      goals,
      goalData,
      user,
      setGoals,
      setNotifications,
      createNotification
    });
  };

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

  return (
    <GoalContext.Provider 
      value={{
        goals,
        goalBank,
        addGoal: handleAddGoal,
        updateGoal: (updatedGoal) => updateGoal({ goals, updatedGoal, setGoals }),
        submitGoal: (goalId) => submitGoal({ goals, goalId, user, setGoals, setNotifications, createNotification, getAllUsers }),
        approveGoal: (goalId, feedback) => approveGoal({ goals, goalId, feedback, user, setGoals, setNotifications, createNotification, getAllUsers }),
        rejectGoal: (goalId, feedback) => rejectGoal({ goals, goalId, feedback, user, setGoals, setNotifications, createNotification, getAllUsers }),
        returnGoalForRevision: (goalId, feedback) => returnGoalForRevision({ goals, goalId, feedback, user, setGoals, setNotifications, createNotification, getAllUsers }),
        deleteGoal: (goalId) => deleteGoal({ goals, goalId, user, setGoals, setNotifications, createNotification }),
        getGoalsByStatus: (status) => getGoalsByStatus({ goals, status, user }),
        getTeamGoals: () => getTeamGoals({ goals, user, getAllUsers }),
        getGoalsForReview,
        addGoalTemplate,
        updateGoalTemplate,
        deleteGoalTemplate,
        getUserNotifications: () => getUserNotifications({ notifications, user }),
        markNotificationAsRead: (notificationId) => markNotificationAsRead({ notifications, notificationId, setNotifications }),
        clearNotifications: () => clearNotifications({ notifications, user, setNotifications }),
        getUnreadNotificationsCount: () => getUnreadNotificationsCount({ notifications, user })
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


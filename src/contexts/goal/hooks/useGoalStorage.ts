
import { useState, useEffect } from 'react';
import { Goal, GoalBank, Notification } from '@/types';
import { initialGoalBank, initialGoals, initialNotifications } from '../initialData';

export const useGoalStorage = () => {
  const [goalBank, setGoalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

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
    }
    
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error("Failed to parse stored notifications:", error);
        setNotifications(initialNotifications);
      }
    }
    
    if (storedGoalBank) {
      try {
        setGoalBank(JSON.parse(storedGoalBank));
      } catch (error) {
        console.error("Failed to parse stored goal bank:", error);
        setGoalBank(initialGoalBank);
      }
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

  return {
    goals,
    setGoals,
    notifications,
    setNotifications,
    goalBank,
    setGoalBank
  };
};

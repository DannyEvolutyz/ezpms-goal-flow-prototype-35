
import { useState, useEffect } from 'react';
import { Goal, GoalBank, Notification, GoalSpace } from '@/types';
import { initialGoalBank, initialNotifications } from '../initialData';

// Sample initial goal spaces
const initialGoalSpaces: GoalSpace[] = [
  {
    id: 'space-1',
    name: 'Annual Goals 2025',
    description: 'Annual performance goals for the year 2025',
    startDate: '2025-01-01',
    submissionDeadline: '2025-02-15',
    reviewDeadline: '2025-02-28',
    createdAt: '2024-12-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'space-2',
    name: 'Half Yearly Goals H1-2025',
    description: 'Half-yearly performance goals for H1 2025',
    startDate: '2025-01-01',
    submissionDeadline: '2025-01-15',
    reviewDeadline: '2025-01-31',
    createdAt: '2024-12-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'space-3',
    name: 'Quarterly Goals Q1-2025',
    description: 'Quarterly performance goals for Q1 2025',
    startDate: '2025-01-01',
    submissionDeadline: '2025-01-10',
    reviewDeadline: '2025-01-20',
    createdAt: '2024-12-05T00:00:00Z',
    isActive: true
  }
];

export const useGoalStorage = () => {
  const [goalBank, setGoalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [spaces, setSpaces] = useState<GoalSpace[]>(initialGoalSpaces);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load stored data from localStorage only once on initialization
    if (!isInitialized) {
      const storedGoals = localStorage.getItem('ezpms_goals');
      const storedNotifications = localStorage.getItem('ezpms_notifications');
      const storedGoalBank = localStorage.getItem('ezpms_goal_bank');
      const storedGoalSpaces = localStorage.getItem('ezpms_goal_spaces');
      
      if (storedGoals) {
        try {
          const parsedGoals = JSON.parse(storedGoals);
          setGoals(parsedGoals);
          console.log('Loaded goals from localStorage:', parsedGoals);
        } catch (error) {
          console.error("Failed to parse stored goals:", error);
          setGoals([]);
        }
      } else {
        console.log('No stored goals found, starting with empty array');
        setGoals([]);
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
      
      if (storedGoalSpaces) {
        try {
          const parsedSpaces = JSON.parse(storedGoalSpaces);
          setSpaces(parsedSpaces);
          console.log('Loaded spaces from localStorage:', parsedSpaces);
        } catch (error) {
          console.error("Failed to parse stored goal spaces:", error);
          setSpaces(initialGoalSpaces);
        }
      } else {
        console.log('No stored spaces found, using initial spaces');
        setSpaces(initialGoalSpaces);
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save data to localStorage whenever state changes, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ezpms_goals', JSON.stringify(goals));
      console.log('Saved goals to localStorage:', goals);
    }
  }, [goals, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ezpms_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ezpms_goal_bank', JSON.stringify(goalBank));
    }
  }, [goalBank, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('ezpms_goal_spaces', JSON.stringify(spaces));
      console.log('Saved spaces to localStorage:', spaces);
    }
  }, [spaces, isInitialized]);

  return {
    goals,
    setGoals,
    notifications,
    setNotifications,
    goalBank,
    setGoalBank,
    spaces,
    setSpaces
  };
};

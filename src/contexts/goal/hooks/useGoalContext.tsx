
import React, { createContext, useContext } from 'react';
import { Goal, GoalBank, GoalSpace, Notification } from '@/types';
import { GoalContextType } from '../types';

// Create the context
export const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Custom hook to use the goal context
export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

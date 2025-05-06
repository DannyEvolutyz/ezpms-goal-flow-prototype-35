
import React from 'react';
import { GoalContextType } from './types';
import { useAuth } from '../AuthContext';
import { useGoalStorage } from './hooks/useGoalStorage';
import { useGoalTemplates } from './hooks/useGoalTemplates';
import { GoalContext } from './hooks/useGoalContext';
import { useGoalMutations } from './hooks/useGoalMutations';
import { useGoalQueries } from './hooks/useGoalQueries';
import { useNotifications } from './hooks/useNotifications';
import { useGoalSpaces } from './hooks/useGoalSpaces';
import { useGoalWorkflow } from './hooks/useGoalWorkflow';

export const GoalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, getAllUsers } = useAuth();
  
  // Use custom hooks for different functionality
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
  
  // Goal templates management
  const { addGoalTemplate, updateGoalTemplate, deleteGoalTemplate } = 
    useGoalTemplates(goalBank, setGoalBank);
  
  // Goal mutations and queries
  const { addGoal, updateGoal, deleteGoal } = useGoalMutations({ 
    goals, setGoals, user, setNotifications, spaces 
  });
  
  const { getGoalsByStatus, getGoalsBySpace, getTeamGoals, getGoalsForReview } = 
    useGoalQueries({ goals, user, getAllUsers });
  
  // Goal workflow
  const { submitGoal, approveGoal, rejectGoal, returnGoalForRevision } = 
    useGoalWorkflow({ goals, setGoals, user, setNotifications, getAllUsers, spaces });
  
  // Goal spaces
  const { 
    createGoalSpace, updateGoalSpace, deleteGoalSpace,
    getActiveSpace, getAvailableSpaces, getAllSpaces,
    getSpacesForReview, canCreateOrEditGoals,
    canReviewGoals, isSpaceReadOnly 
  } = useGoalSpaces({ spaces, setSpaces, user, setNotifications });
  
  // Notifications
  const { 
    getUserNotifications, markNotificationAsRead,
    clearNotifications, getUnreadNotificationsCount 
  } = useNotifications({ notifications, user, setNotifications });

  const contextValue: GoalContextType = {
    goals,
    goalBank,
    spaces,
    
    // Goal CRUD operations
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Goal queries
    getGoalsByStatus,
    getGoalsBySpace,
    getTeamGoals,
    getGoalsForReview,
    
    // Goal Bank operations
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
    
    // Goal workflow
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision,
    
    // Goal Space operations
    createGoalSpace,
    updateGoalSpace,
    deleteGoalSpace,
    getActiveSpace,
    getAvailableSpaces,
    getAllSpaces,
    getSpacesForReview,
    canCreateOrEditGoals,
    canReviewGoals,
    isSpaceReadOnly,
    
    // Notification operations
    getUserNotifications,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount
  };

  return (
    <GoalContext.Provider value={contextValue}>
      {children}
    </GoalContext.Provider>
  );
};

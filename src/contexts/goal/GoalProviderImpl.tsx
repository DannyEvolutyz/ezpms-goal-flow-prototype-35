
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
  
  const { 
    goals, setGoals, 
    notifications, setNotifications, 
    goalBank, setGoalBank,
    spaces, setSpaces,
    refetchGoals, refetchSpaces, refetchGoalBank, refetchNotifications
  } = useGoalStorage();
  
  const { addGoalTemplate, updateGoalTemplate, deleteGoalTemplate } = 
    useGoalTemplates(goalBank, setGoalBank, refetchGoalBank);
  
  const { addGoal, updateGoal, deleteGoal } = useGoalMutations({ 
    goals, user, setNotifications, spaces, refetchGoals
  });
  
  const { getGoalsByStatus, getGoalsBySpace, getTeamGoals, getGoalsForReview } = 
    useGoalQueries({ goals, user, getAllUsers });
  
  const { submitGoal, approveGoal, rejectGoal, returnGoalForRevision } = 
    useGoalWorkflow({ goals, user, getAllUsers, spaces, refetchGoals });
  
  const { 
    createGoalSpace, updateGoalSpace, deleteGoalSpace,
    getActiveSpace, getAvailableSpaces, getAllSpaces,
    getSpacesForReview, canCreateOrEditGoals,
    canReviewGoals, isSpaceReadOnly 
  } = useGoalSpaces({ spaces, user, refetchSpaces });
  
  const { 
    getUserNotifications, markNotificationAsRead,
    clearNotifications, getUnreadNotificationsCount 
  } = useNotifications({ notifications, user, setNotifications });

  const contextValue: GoalContextType = {
    goals,
    goalBank,
    spaces,
    
    addGoal,
    updateGoal,
    deleteGoal,
    
    getGoalsByStatus,
    getGoalsBySpace,
    getTeamGoals,
    getGoalsForReview,
    
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
    
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision,
    
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
    
    getUserNotifications,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount,
    
    refetchGoals,
    refetchSpaces,
    refetchGoalBank,
    refetchNotifications
  };

  return (
    <GoalContext.Provider value={contextValue}>
      {children}
    </GoalContext.Provider>
  );
};

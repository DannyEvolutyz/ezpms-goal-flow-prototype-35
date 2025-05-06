
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { addGoal as addGoalService } from '../services/goalMutation';
import { updateGoal as updateGoalService } from '../services/goalMutation';
import { deleteGoal as deleteGoalService } from '../services/goalDelete';
import { canCreateOrEditGoals } from '../services/goalSpaces';
import { createNotification } from '../services/notifications';

interface UseGoalMutationsParams {
  goals: Goal[];
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  spaces: any[];
}

export const useGoalMutations = ({
  goals,
  user,
  setGoals,
  setNotifications,
  spaces
}: UseGoalMutationsParams) => {
  
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback' | 'spaceId'> & { spaceId: string }) => {
    return addGoalService({
      goals,
      goalData,
      user,
      setGoals,
      setNotifications,
      createNotification,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    });
  };
  
  const updateGoal = (updatedGoal: Goal) => {
    return updateGoalService({
      goals,
      updatedGoal,
      setGoals,
      user,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId }),
      setNotifications,
      createNotification
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
  
  return {
    addGoal,
    updateGoal,
    deleteGoal
  };
};

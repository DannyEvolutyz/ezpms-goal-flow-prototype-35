
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import {
  submitGoal as submitGoalService,
  approveGoal as approveGoalService,
  rejectGoal as rejectGoalService,
  returnGoalForRevision as returnGoalForRevisionService
} from '../services/goalWorkflow';
import { canCreateOrEditGoals, canReviewGoals } from '../services/goalSpaces';
import { createNotification } from '../services/notifications';

interface UseGoalWorkflowParams {
  goals: Goal[];
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  user: any;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  getAllUsers: () => any[];
  spaces: any[];
}

export const useGoalWorkflow = ({
  goals,
  setGoals,
  user,
  setNotifications,
  getAllUsers,
  spaces
}: UseGoalWorkflowParams) => {
  
  const submitGoal = (goalId: string) => {
    return submitGoalService({
      goals,
      goalId,
      user,
      setGoals,
      setNotifications,
      createNotification,
      getAllUsers,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    });
  };
  
  const approveGoal = (goalId: string, feedback?: string) => {
    return approveGoalService({
      goals,
      goalId,
      feedback: feedback || '',
      user,
      setGoals,
      setNotifications,
      createNotification,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
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
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
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
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId })
    });
  };
  
  return {
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision
  };
};


import { Goal } from '@/types';
import {
  submitGoal as submitGoalService,
  approveGoal as approveGoalService,
  rejectGoal as rejectGoalService,
  returnGoalForRevision as returnGoalForRevisionService
} from '../services/goalWorkflow';
import { canCreateOrEditGoals, canReviewGoals } from '../services/goalSpaces';
import { createDbNotification } from '../services/notifications/createNotification';

interface UseGoalWorkflowParams {
  goals: Goal[];
  user: any;
  getAllUsers: () => any[];
  spaces: any[];
  refetchGoals: () => Promise<void>;
}

export const useGoalWorkflow = ({
  goals,
  user,
  getAllUsers,
  spaces,
  refetchGoals
}: UseGoalWorkflowParams) => {
  
  const submitGoal = async (goalId: string) => {
    await submitGoalService({
      goals,
      goalId,
      user,
      refetchGoals,
      getAllUsers,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId }),
      createDbNotification
    });
  };
  
  const approveGoal = async (goalId: string, feedback?: string) => {
    await approveGoalService({
      goals,
      goalId,
      user,
      feedback: feedback || '',
      refetchGoals,
      getAllUsers,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId }),
      createDbNotification
    });
  };
  
  const rejectGoal = async (goalId: string, feedback: string) => {
    await rejectGoalService({
      goals,
      goalId,
      user,
      feedback,
      refetchGoals,
      getAllUsers,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId }),
      createDbNotification
    });
  };
  
  const returnGoalForRevision = async (goalId: string, feedback: string) => {
    await returnGoalForRevisionService({
      goals,
      goalId,
      user,
      feedback,
      refetchGoals,
      getAllUsers,
      canReviewGoals: (spaceId) => canReviewGoals({ spaces, spaceId }),
      createDbNotification
    });
  };
  
  return {
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision
  };
};

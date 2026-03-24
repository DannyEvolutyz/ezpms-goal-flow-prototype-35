
import { GoalSpace } from '@/types';
import {
  createGoalSpace as createGoalSpaceService,
  updateGoalSpace as updateGoalSpaceService,
  deleteGoalSpace as deleteGoalSpaceService,
  getActiveSpace as getActiveSpaceService,
  getAvailableSpaces as getAvailableSpacesService,
  getAllSpaces as getAllSpacesService,
  getSpacesForReview as getSpacesForReviewService,
  canCreateOrEditGoals as canCreateOrEditGoalsService,
  canReviewGoals as canReviewGoalsService,
  isSpaceReadOnly as isSpaceReadOnlyService
} from '../services/goalSpaces';

interface UseGoalSpacesParams {
  spaces: GoalSpace[];
  user: any;
  refetchSpaces: () => Promise<void>;
}

export const useGoalSpaces = ({
  spaces,
  user,
  refetchSpaces
}: UseGoalSpacesParams) => {
  
  const createGoalSpace = async (spaceData: Omit<GoalSpace, 'id' | 'createdAt' | 'isActive'>) => {
    return createGoalSpaceService({
      ...spaceData,
      user,
      refetchSpaces
    });
  };
  
  const updateGoalSpace = async (spaceId: string, updatedSpace: Partial<GoalSpace>) => {
    await updateGoalSpaceService({
      spaceId,
      updatedSpace,
      user,
      refetchSpaces
    });
  };
  
  const deleteGoalSpace = async (spaceId: string) => {
    await deleteGoalSpaceService({
      spaceId,
      user,
      refetchSpaces
    });
  };
  
  const getActiveSpace = () => getActiveSpaceService({ spaces });
  const getAvailableSpaces = () => getAvailableSpacesService({ spaces });
  const getAllSpaces = () => getAllSpacesService({ spaces });
  const getSpacesForReview = () => getSpacesForReviewService({ spaces });
  const canCreateOrEditGoals = (spaceId?: string) => canCreateOrEditGoalsService({ spaces, spaceId });
  const canReviewGoals = (spaceId?: string) => canReviewGoalsService({ spaces, spaceId });
  const isSpaceReadOnly = (spaceId?: string) => isSpaceReadOnlyService({ spaces, spaceId, isAdmin: user?.role === 'admin' });
  
  return {
    createGoalSpace, updateGoalSpace, deleteGoalSpace,
    getActiveSpace, getAvailableSpaces, getAllSpaces,
    getSpacesForReview, canCreateOrEditGoals, canReviewGoals, isSpaceReadOnly
  };
};

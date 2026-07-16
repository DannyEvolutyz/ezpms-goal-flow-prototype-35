
import { GoalSpace } from '@/types';
import {
  createGoalSpace as createGoalSpaceService,
  updateGoalSpace as updateGoalSpaceService,
  deleteGoalSpace as deleteGoalSpaceService,
  getActiveSpace as getActiveSpaceService,
  getAvailableSpaces as getAvailableSpacesService,
  getAllSpaces as getAllSpacesService,
  getSpacesForReview as getSpacesForReviewService,
  getSpacesForRating as getSpacesForRatingService,
  getParentSpaces as getParentSpacesService,
  getSubSpaces as getSubSpacesService,
  canCreateOrEditGoals as canCreateOrEditGoalsService,
  canReviewGoals as canReviewGoalsService,
  canRateGoals as canRateGoalsService,
  canEditCycleGoal as canEditCycleGoalService,
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

  const createGoalSpace = async (
    spaceData: Omit<GoalSpace, 'id' | 'createdAt' | 'isActive'>
  ) => {
    return createGoalSpaceService({
      name: spaceData.name,
      description: spaceData.description,
      parentId: spaceData.parentId ?? null,
      spaceKind: spaceData.spaceKind,
      startDate: spaceData.startDate ?? null,
      submissionDeadline: spaceData.submissionDeadline ?? null,
      reviewDeadline: spaceData.reviewDeadline ?? null,
      editStartDate: spaceData.editStartDate ?? null,
      editEndDate: spaceData.editEndDate ?? null,
      ratingStartDate: spaceData.ratingStartDate ?? null,
      ratingDeadline: spaceData.ratingDeadline ?? null,
      user,
      refetchSpaces
    });
  };

  const updateGoalSpace = async (spaceId: string, updatedSpace: Partial<GoalSpace>) => {
    await updateGoalSpaceService({ spaceId, updatedSpace, user, refetchSpaces });
  };

  const deleteGoalSpace = async (spaceId: string) => {
    await deleteGoalSpaceService({ spaceId, user, refetchSpaces });
  };

  return {
    createGoalSpace, updateGoalSpace, deleteGoalSpace,
    getActiveSpace: () => getActiveSpaceService({ spaces }),
    getAvailableSpaces: () => getAvailableSpacesService({ spaces }),
    getAllSpaces: () => getAllSpacesService({ spaces }),
    getSpacesForReview: () => getSpacesForReviewService({ spaces }),
    getSpacesForRating: () => getSpacesForRatingService({ spaces }),
    getParentSpaces: () => getParentSpacesService({ spaces }),
    getSubSpaces: (parentId: string) => getSubSpacesService({ spaces, parentId }),
    canCreateOrEditGoals: (spaceId?: string) => canCreateOrEditGoalsService({ spaces, spaceId }),
    canReviewGoals: (spaceId?: string) => canReviewGoalsService({ spaces, spaceId }),
    canRateGoals: (spaceId?: string) => canRateGoalsService({ spaces, spaceId }),
    canEditCycleGoal: (spaceId?: string) => canEditCycleGoalService({ spaces, spaceId }),
    isSpaceReadOnly: (spaceId?: string) => isSpaceReadOnlyService({ spaces, spaceId, isAdmin: user?.role === 'admin' })
  };
};

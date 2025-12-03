
import { GoalSpace } from '@/types';
import { Dispatch, SetStateAction } from 'react';
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
import { createNotification } from '../services/notifications';

interface UseGoalSpacesParams {
  spaces: GoalSpace[];
  setSpaces: Dispatch<SetStateAction<GoalSpace[]>>;
  user: any;
  setNotifications: Dispatch<SetStateAction<any[]>>;
}

export const useGoalSpaces = ({
  spaces,
  setSpaces,
  user,
  setNotifications
}: UseGoalSpacesParams) => {
  
  const createGoalSpace = (spaceData: Omit<GoalSpace, 'id' | 'createdAt' | 'isActive'>) => {
    return createGoalSpaceService({
      ...spaceData,
      spaces,
      setSpaces,
      setNotifications,
      createNotification,
      user
    });
  };
  
  const updateGoalSpace = (spaceId: string, updatedSpace: Partial<GoalSpace>) => {
    return updateGoalSpaceService({
      spaceId,
      updatedSpace,
      spaces,
      setSpaces,
      user
    });
  };
  
  const deleteGoalSpace = (spaceId: string) => {
    return deleteGoalSpaceService({
      spaceId,
      spaces,
      setSpaces,
      user
    });
  };
  
  const getActiveSpace = () => {
    return getActiveSpaceService({ spaces });
  };
  
  const getAvailableSpaces = () => {
    return getAvailableSpacesService({ spaces });
  };
  
  const getAllSpaces = () => {
    return getAllSpacesService({ spaces });
  };
  
  const getSpacesForReview = () => {
    return getSpacesForReviewService({ spaces });
  };
  
  const canCreateOrEditGoals = (spaceId?: string) => {
    return canCreateOrEditGoalsService({ spaces, spaceId });
  };
  
  const canReviewGoals = (spaceId?: string) => {
    return canReviewGoalsService({ spaces, spaceId });
  };
  
  const isSpaceReadOnly = (spaceId?: string) => {
    return isSpaceReadOnlyService({ spaces, spaceId, isAdmin: user?.role === 'admin' });
  };
  
  return {
    createGoalSpace,
    updateGoalSpace,
    deleteGoalSpace,
    getActiveSpace,
    getAvailableSpaces,
    getAllSpaces,
    getSpacesForReview,
    canCreateOrEditGoals,
    canReviewGoals,
    isSpaceReadOnly
  };
};

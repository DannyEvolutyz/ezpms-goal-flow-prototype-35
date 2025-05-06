
import { Goal } from '@/types';
import { 
  getGoalsByStatus as getGoalsByStatusService,
  getGoalsBySpace as getGoalsBySpaceService, 
  getTeamGoals as getTeamGoalsService,
  getGoalsForReview as getGoalsForReviewService
} from '../services/goalQuery';

interface UseGoalQueriesParams {
  goals: Goal[];
  user: any;
  getAllUsers: () => any[];
}

export const useGoalQueries = ({
  goals,
  user,
  getAllUsers
}: UseGoalQueriesParams) => {
  
  const getGoalsByStatus = (status: string) => {
    return getGoalsByStatusService({
      goals,
      status,
      user
    });
  };
  
  const getGoalsBySpace = (spaceId: string) => {
    return getGoalsBySpaceService({
      goals,
      spaceId,
      user
    });
  };
  
  const getTeamGoals = () => {
    return getTeamGoalsService({
      goals,
      user,
      getAllUsers
    });
  };
  
  const getGoalsForReview = () => {
    return getGoalsForReviewService();
  };
  
  return {
    getGoalsByStatus,
    getGoalsBySpace,
    getTeamGoals,
    getGoalsForReview
  };
};

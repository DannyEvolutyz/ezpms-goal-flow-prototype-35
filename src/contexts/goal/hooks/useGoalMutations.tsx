
import { Goal } from '@/types';
import { addGoal as addGoalService } from '../services/goalMutation';
import { updateGoal as updateGoalService } from '../services/goalMutation';
import { deleteGoal as deleteGoalService } from '../services/goalDelete';
import { canCreateOrEditGoals } from '../services/goalSpaces';
import { createNotification } from '../services/notifications';

interface UseGoalMutationsParams {
  goals: Goal[];
  user: any;
  setNotifications: any;
  spaces: any[];
  refetchGoals: () => Promise<void>;
}

export const useGoalMutations = ({
  goals,
  user,
  setNotifications,
  spaces,
  refetchGoals
}: UseGoalMutationsParams) => {
  
  const addGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback' | 'spaceId'> & { spaceId: string }) => {
    const result = await addGoalService({
      goalData,
      user,
      refetchGoals,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    });
    
    if (result) {
      await createNotification({
        userId: user.id,
        title: 'Goal Created Successfully',
        message: `You've created a new goal: ${result.title}`,
        type: 'success',
        targetType: 'goal',
        targetId: result.id,
        setNotifications
      });
    }
    
    return result;
  };
  
  const updateGoal = async (updatedGoal: Goal) => {
    await updateGoalService({
      updatedGoal,
      user,
      refetchGoals,
      canCreateOrEditGoals: (spaceId) => canCreateOrEditGoals({ spaces, spaceId })
    });
  };
  
  const deleteGoal = async (goalId: string) => {
    await deleteGoalService({
      goalId,
      user,
      refetchGoals
    });
  };
  
  return {
    addGoal,
    updateGoal,
    deleteGoal
  };
};

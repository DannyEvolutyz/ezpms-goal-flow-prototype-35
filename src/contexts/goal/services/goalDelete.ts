
import { supabase } from '@/integrations/supabase/client';

interface DeleteGoalParams {
  goalId: string;
  user: any;
  refetchGoals: () => Promise<void>;
}

export const deleteGoal = async ({
  goalId,
  user,
  refetchGoals
}: DeleteGoalParams) => {
  if (!user) return;
  
  // Delete milestones first (cascade should handle but be explicit)
  await supabase.from('milestones').delete().eq('goal_id', goalId);
  
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);
  
  if (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
  
  await refetchGoals();
  return true;
};

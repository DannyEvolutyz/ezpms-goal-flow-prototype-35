
import { Goal } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AddGoalParams {
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>;
  user: any;
  refetchGoals: () => Promise<void>;
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
}

export const addGoal = async ({
  goalData,
  user,
  refetchGoals,
  canCreateOrEditGoals
}: AddGoalParams): Promise<Goal | undefined> => {
  if (!user) return;
  
  if (canCreateOrEditGoals && !canCreateOrEditGoals(goalData.spaceId)) {
    throw new Error('You cannot create goals in this space right now due to submission deadline.');
  }
  
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      space_id: goalData.spaceId,
      title: goalData.title,
      description: goalData.description,
      category: goalData.category,
      priority: goalData.priority,
      target_date: goalData.targetDate,
      weightage: goalData.weightage || 0,
      status: 'draft'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
  
  // Insert milestones if any
  if (goalData.milestones && goalData.milestones.length > 0) {
    const milestonesInsert = goalData.milestones.map(m => ({
      goal_id: data.id,
      title: m.title,
      description: m.description || null,
      target_date: m.targetDate || null,
      completed: false
    }));
    
    await supabase.from('milestones').insert(milestonesInsert);
  }
  
  await refetchGoals();
  
  return {
    id: data.id,
    userId: data.user_id,
    spaceId: data.space_id,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority as Goal['priority'],
    targetDate: data.target_date,
    status: data.status as Goal['status'],
    feedback: data.feedback || '',
    weightage: data.weightage,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    milestones: goalData.milestones || []
  };
};

interface UpdateGoalParams {
  updatedGoal: Goal;
  user: any;
  refetchGoals: () => Promise<void>;
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
}

export const updateGoal = async ({
  updatedGoal,
  user,
  refetchGoals,
  canCreateOrEditGoals
}: UpdateGoalParams) => {
  if (!user) return;
  
  const { error } = await supabase
    .from('goals')
    .update({
      title: updatedGoal.title,
      description: updatedGoal.description,
      category: updatedGoal.category,
      priority: updatedGoal.priority,
      target_date: updatedGoal.targetDate,
      weightage: updatedGoal.weightage,
      status: updatedGoal.status,
      feedback: updatedGoal.feedback || null,
      rating: updatedGoal.rating || null,
      rating_comment: updatedGoal.ratingComment || null,
      reviewer_id: updatedGoal.reviewerId || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', updatedGoal.id);
  
  if (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
  
  // Update milestones: delete existing and re-insert
  if (updatedGoal.milestones) {
    await supabase.from('milestones').delete().eq('goal_id', updatedGoal.id);
    
    if (updatedGoal.milestones.length > 0) {
      const milestonesInsert = updatedGoal.milestones.map(m => ({
        goal_id: updatedGoal.id,
        title: m.title,
        description: m.description || null,
        target_date: m.targetDate || null,
        completed: m.completed || false,
        completion_comment: m.completionComment || null
      }));
      
      await supabase.from('milestones').insert(milestonesInsert);
    }
  }
  
  await refetchGoals();
  return updatedGoal;
};

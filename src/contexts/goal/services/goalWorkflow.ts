import { supabase } from '@/integrations/supabase/client';

interface WorkflowParams {
  goalId: string;
  user: any;
  feedback?: string;
  refetchGoals: () => Promise<void>;
  getAllUsers: () => any[];
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
  canReviewGoals?: (spaceId?: string) => boolean;
  goals: any[];
  createDbNotification: (userId: string, title: string, message: string, type: string, targetId?: string, targetType?: string) => Promise<void>;
}

const updateGoalStatus = async (goalId: string, status: string, feedback?: string) => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };
  if (feedback !== undefined) updateData.feedback = feedback;
  
  const { error } = await supabase
    .from('goals')
    .update(updateData)
    .eq('id', goalId);
  
  if (error) throw error;
};

export const submitGoal = async ({
  goals, goalId, user, refetchGoals, getAllUsers, canCreateOrEditGoals, createDbNotification
}: WorkflowParams) => {
  if (!user) return;
  
  const goalToSubmit = goals.find((g: any) => g.id === goalId);
  if (!goalToSubmit || goalToSubmit.userId !== user.id) return;
  
  if (canCreateOrEditGoals && !canCreateOrEditGoals(goalToSubmit.spaceId)) {
    throw new Error('Cannot submit goals in this space right now.');
  }
  
  await updateGoalStatus(goalId, 'submitted');
  
  await createDbNotification(user.id, 'Goal Submitted Successfully', `You've submitted your goal: ${goalToSubmit.title}`, 'success', goalId, 'goal');
  
  const allUsers = getAllUsers();
  const manager = allUsers.find((u: any) => u.id === user.managerId);
  if (manager) {
    await createDbNotification(manager.id, 'New Goal Submitted for Review', `${user.name} has submitted a goal for your review: ${goalToSubmit.title}`, 'info', goalId, 'goal');
  }
  
  await refetchGoals();
};

export const approveGoal = async ({
  goals, goalId, user, feedback, refetchGoals, canReviewGoals, createDbNotification
}: WorkflowParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goal = goals.find((g: any) => g.id === goalId);
  if (!goal) return;
  
  await updateGoalStatus(goalId, 'approved', feedback);
  
  await createDbNotification(goal.userId, 'Goal Approved! 🎉', `Your goal "${goal.title}" has been approved.`, 'success', goalId, 'goal');
  
  await refetchGoals();
};

export const rejectGoal = async ({
  goals, goalId, user, feedback, refetchGoals, canReviewGoals, createDbNotification
}: WorkflowParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goal = goals.find((g: any) => g.id === goalId);
  if (!goal) return;
  
  await updateGoalStatus(goalId, 'rejected', feedback);
  
  await createDbNotification(goal.userId, 'Goal Rejected', `Your goal "${goal.title}" has been rejected. Please check the feedback.`, 'error', goalId, 'goal');
  
  await refetchGoals();
};

export const returnGoalForRevision = async ({
  goals, goalId, user, feedback, refetchGoals, canReviewGoals, createDbNotification
}: WorkflowParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goal = goals.find((g: any) => g.id === goalId);
  if (!goal) return;
  
  await updateGoalStatus(goalId, 'under_review', feedback);
  
  await createDbNotification(goal.userId, 'Goal Needs Revision', `Your goal "${goal.title}" requires revision.`, 'warning', goalId, 'goal');
  
  await refetchGoals();
};

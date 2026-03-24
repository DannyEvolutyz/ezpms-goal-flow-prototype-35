
import { GoalSpace } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CreateGoalSpaceParams {
  name: string;
  description?: string;
  startDate: string;
  submissionDeadline: string;
  reviewDeadline: string;
  user: any;
  refetchSpaces: () => Promise<void>;
}

export const createGoalSpace = async ({
  name, description, startDate, submissionDeadline, reviewDeadline, user, refetchSpaces
}: CreateGoalSpaceParams): Promise<GoalSpace | null> => {
  if (!user || user.role !== 'admin') return null;
  
  const startDateObj = new Date(startDate);
  const submissionDeadlineObj = new Date(submissionDeadline);
  const reviewDeadlineObj = new Date(reviewDeadline);
  
  if (submissionDeadlineObj < startDateObj) throw new Error("Submission deadline must be after start date");
  if (reviewDeadlineObj < submissionDeadlineObj) throw new Error("Review deadline must be after submission deadline");
  
  const { data, error } = await supabase
    .from('goal_spaces')
    .insert({
      name,
      description: description || null,
      start_date: startDate,
      submission_deadline: submissionDeadline,
      review_deadline: reviewDeadline,
      is_active: true
    })
    .select()
    .single();
  
  if (error) throw error;
  
  await refetchSpaces();
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    startDate: data.start_date,
    submissionDeadline: data.submission_deadline,
    reviewDeadline: data.review_deadline,
    createdAt: data.created_at,
    isActive: data.is_active
  };
};

interface UpdateGoalSpaceParams {
  spaceId: string;
  updatedSpace: Partial<GoalSpace>;
  user: any;
  refetchSpaces: () => Promise<void>;
}

export const updateGoalSpace = async ({
  spaceId, updatedSpace, user, refetchSpaces
}: UpdateGoalSpaceParams) => {
  if (!user || user.role !== 'admin') return null;
  
  const updateData: any = {};
  if (updatedSpace.name !== undefined) updateData.name = updatedSpace.name;
  if (updatedSpace.description !== undefined) updateData.description = updatedSpace.description;
  if (updatedSpace.startDate !== undefined) updateData.start_date = updatedSpace.startDate;
  if (updatedSpace.submissionDeadline !== undefined) updateData.submission_deadline = updatedSpace.submissionDeadline;
  if (updatedSpace.reviewDeadline !== undefined) updateData.review_deadline = updatedSpace.reviewDeadline;
  if (updatedSpace.isActive !== undefined) updateData.is_active = updatedSpace.isActive;
  
  const { error } = await supabase
    .from('goal_spaces')
    .update(updateData)
    .eq('id', spaceId);
  
  if (error) throw error;
  
  await refetchSpaces();
};

interface DeleteGoalSpaceParams {
  spaceId: string;
  user: any;
  refetchSpaces: () => Promise<void>;
}

export const deleteGoalSpace = async ({
  spaceId, user, refetchSpaces
}: DeleteGoalSpaceParams) => {
  if (!user || user.role !== 'admin') return null;
  
  const { error } = await supabase
    .from('goal_spaces')
    .delete()
    .eq('id', spaceId);
  
  if (error) throw error;
  
  await refetchSpaces();
  return true;
};

// These remain pure functions working on in-memory data (already fetched from DB)
interface SpacesParams { spaces: GoalSpace[] }

export const getActiveSpace = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return spaces.find(space => 
    space.isActive && new Date(space.startDate) <= now && new Date(space.reviewDeadline) >= now
  );
};

export const canCreateOrEditGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return false;
  const now = new Date();
  return space.isActive && new Date(space.startDate) <= now && new Date(space.submissionDeadline) >= now;
};

export const canReviewGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return false;
  const now = new Date();
  return space.isActive && new Date(space.startDate) <= now && new Date(space.reviewDeadline) >= now;
};

export const getAvailableSpaces = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return spaces.filter(space => 
    space.isActive && new Date(space.startDate) <= now && new Date(space.submissionDeadline) >= now
  );
};

export const getAllSpaces = ({ spaces }: SpacesParams) => {
  return [...spaces].sort((a, b) => 
    (a.isActive === b.isActive) ? 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime() :
      a.isActive ? -1 : 1
  );
};

export const getSpacesForReview = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return spaces.filter(space => 
    space.isActive && new Date(space.submissionDeadline) <= now && new Date(space.reviewDeadline) >= now
  );
};

export const isSpaceReadOnly = ({ spaces, spaceId, isAdmin }: { spaces: GoalSpace[]; spaceId?: string; isAdmin?: boolean }) => {
  if (isAdmin) return false;
  if (!spaceId) return true;
  const space = spaces.find(s => s.id === spaceId);
  if (!space) return true;
  const now = new Date();
  return !space.isActive || new Date(space.submissionDeadline) < now;
};

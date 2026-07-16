
import { GoalSpace } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CreateGoalSpaceParams {
  name: string;
  description?: string;
  parentId?: string | null;
  startDate?: string | null;
  submissionDeadline?: string | null;
  reviewDeadline?: string | null;
  ratingStartDate?: string | null;
  ratingDeadline?: string | null;
  user: any;
  refetchSpaces: () => Promise<void>;
}

export const createGoalSpace = async ({
  name, description, parentId, startDate, submissionDeadline, reviewDeadline,
  ratingStartDate, ratingDeadline, user, refetchSpaces
}: CreateGoalSpaceParams): Promise<GoalSpace | null> => {
  if (!user || user.role !== 'admin') return null;

  const isParent = !parentId;

  if (!isParent) {
    if (!startDate || !submissionDeadline || !reviewDeadline || !ratingStartDate || !ratingDeadline) {
      throw new Error('Sub-spaces require all timeline dates');
    }
    const s = new Date(startDate), sub = new Date(submissionDeadline),
      r = new Date(reviewDeadline), rs = new Date(ratingStartDate), rd = new Date(ratingDeadline);
    if (!(s <= sub && sub <= r && r <= rs && rs <= rd)) {
      throw new Error('Timeline must be ordered: start ≤ submission ≤ review ≤ rating start ≤ rating deadline');
    }
  }

  const { data, error } = await supabase
    .from('goal_spaces')
    .insert({
      name,
      description: description || null,
      parent_id: parentId || null,
      start_date: isParent ? null : startDate,
      submission_deadline: isParent ? null : submissionDeadline,
      review_deadline: isParent ? null : reviewDeadline,
      rating_start_date: isParent ? null : ratingStartDate,
      rating_deadline: isParent ? null : ratingDeadline,
      is_active: true
    } as any)
    .select()
    .single();

  if (error) throw error;
  await refetchSpaces();

  const d: any = data;
  return {
    id: d.id,
    name: d.name,
    description: d.description || '',
    parentId: d.parent_id || null,
    startDate: d.start_date,
    submissionDeadline: d.submission_deadline,
    reviewDeadline: d.review_deadline,
    ratingStartDate: d.rating_start_date,
    ratingDeadline: d.rating_deadline,
    createdAt: d.created_at,
    isActive: d.is_active
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
  if (updatedSpace.ratingStartDate !== undefined) updateData.rating_start_date = updatedSpace.ratingStartDate;
  if (updatedSpace.ratingDeadline !== undefined) updateData.rating_deadline = updatedSpace.ratingDeadline;
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

interface SpacesParams { spaces: GoalSpace[] }

// Only sub-spaces hold goals and timelines
const subOnly = (spaces: GoalSpace[]) => spaces.filter(s => !!s.parentId);

export const getActiveSpace = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return subOnly(spaces).find(space =>
    space.isActive && space.startDate && space.reviewDeadline &&
    new Date(space.startDate) <= now && new Date(space.reviewDeadline) >= now
  );
};

export const canCreateOrEditGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const space = spaces.find(s => s.id === spaceId);
  if (!space || !space.parentId || !space.startDate || !space.submissionDeadline) return false;
  const now = new Date();
  return space.isActive && new Date(space.startDate) <= now && new Date(space.submissionDeadline) >= now;
};

export const canReviewGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const space = spaces.find(s => s.id === spaceId);
  if (!space || !space.parentId || !space.startDate || !space.reviewDeadline) return false;
  const now = new Date();
  return space.isActive && new Date(space.startDate) <= now && new Date(space.reviewDeadline) >= now;
};

export const canRateGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const space = spaces.find(s => s.id === spaceId);
  if (!space || !space.parentId || !space.ratingStartDate || !space.ratingDeadline) return false;
  const now = new Date();
  return space.isActive && new Date(space.ratingStartDate) <= now && new Date(space.ratingDeadline) >= now;
};

export const getAvailableSpaces = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return subOnly(spaces).filter(space =>
    space.isActive && space.startDate && space.submissionDeadline &&
    new Date(space.startDate) <= now && new Date(space.submissionDeadline) >= now
  );
};

export const getAllSpaces = ({ spaces }: SpacesParams) => {
  return [...spaces].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getSpacesForReview = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return subOnly(spaces).filter(space =>
    space.isActive && space.submissionDeadline && space.reviewDeadline &&
    new Date(space.submissionDeadline) <= now && new Date(space.reviewDeadline) >= now
  );
};

export const getSpacesForRating = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return subOnly(spaces).filter(space =>
    space.isActive && space.ratingStartDate && space.ratingDeadline &&
    new Date(space.ratingStartDate) <= now && new Date(space.ratingDeadline) >= now
  );
};

export const getParentSpaces = ({ spaces }: SpacesParams) =>
  spaces.filter(s => !s.parentId).sort((a, b) => a.name.localeCompare(b.name));

export const getSubSpaces = ({ spaces, parentId }: { spaces: GoalSpace[]; parentId: string }) =>
  spaces.filter(s => s.parentId === parentId).sort((a, b) =>
    new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime()
  );

export const isSpaceReadOnly = ({ spaces, spaceId, isAdmin }: { spaces: GoalSpace[]; spaceId?: string; isAdmin?: boolean }) => {
  if (isAdmin) return false;
  if (!spaceId) return true;
  const space = spaces.find(s => s.id === spaceId);
  if (!space || !space.parentId || !space.submissionDeadline) return true;
  const now = new Date();
  return !space.isActive || new Date(space.submissionDeadline) < now;
};

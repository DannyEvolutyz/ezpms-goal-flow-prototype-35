
import { GoalSpace, SpaceKind } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CreateGoalSpaceParams {
  name: string;
  description?: string;
  parentId?: string | null;
  spaceKind: SpaceKind;
  // goal_setting dates (also used when creating parent — parent is created first then its GS)
  startDate?: string | null;
  submissionDeadline?: string | null;
  reviewDeadline?: string | null;
  // cycle dates
  editStartDate?: string | null;
  editEndDate?: string | null;
  ratingStartDate?: string | null;
  ratingDeadline?: string | null;
  user: any;
  refetchSpaces: () => Promise<void>;
}

const toRow = (d: any) => ({
  id: d.id,
  name: d.name,
  description: d.description || '',
  parentId: d.parent_id || null,
  spaceKind: (d.space_kind || 'cycle') as SpaceKind,
  startDate: d.start_date,
  submissionDeadline: d.submission_deadline,
  reviewDeadline: d.review_deadline,
  editStartDate: d.edit_start_date,
  editEndDate: d.edit_end_date,
  ratingStartDate: d.rating_start_date,
  ratingDeadline: d.rating_deadline,
  createdAt: d.created_at,
  isActive: d.is_active
}) as GoalSpace;

export const createGoalSpace = async ({
  name, description, parentId, spaceKind,
  startDate, submissionDeadline, reviewDeadline,
  editStartDate, editEndDate, ratingStartDate, ratingDeadline,
  user, refetchSpaces
}: CreateGoalSpaceParams): Promise<GoalSpace | null> => {
  if (!user || user.role !== 'admin') return null;

  if (spaceKind === 'parent') {
    // Parent requires GS timeline dates so the auto Goal Setting can be created
    if (!startDate || !submissionDeadline || !reviewDeadline) {
      throw new Error('Goal Setting dates are required to create a Goal Space');
    }
    const s = new Date(startDate), sub = new Date(submissionDeadline), r = new Date(reviewDeadline);
    if (!(s <= sub && sub <= r)) {
      throw new Error('Dates must be ordered: start ≤ submission ≤ review');
    }

    const { data: parent, error: pErr } = await supabase
      .from('goal_spaces')
      .insert({ name, description: description || null, space_kind: 'parent', is_active: true } as any)
      .select().single();
    if (pErr) throw pErr;

    const { error: gsErr } = await supabase
      .from('goal_spaces')
      .insert({
        name: 'Goal Setting',
        description: 'Author and approve goals for this space',
        parent_id: parent.id,
        space_kind: 'goal_setting',
        start_date: startDate,
        submission_deadline: submissionDeadline,
        review_deadline: reviewDeadline,
        is_active: true
      } as any);
    if (gsErr) {
      await supabase.from('goal_spaces').delete().eq('id', parent.id);
      throw gsErr;
    }

    await refetchSpaces();
    return toRow(parent);
  }

  if (spaceKind === 'cycle') {
    if (!parentId) throw new Error('Cycle spaces need a parent');
    if (!editStartDate || !editEndDate || !ratingStartDate || !ratingDeadline) {
      throw new Error('Cycles require edit and rating dates');
    }
    const es = new Date(editStartDate), ee = new Date(editEndDate),
      rs = new Date(ratingStartDate), rd = new Date(ratingDeadline);
    if (!(es <= ee && ee <= rs && rs <= rd)) {
      throw new Error('Cycle dates must be ordered: edit start ≤ edit end ≤ rating start ≤ rating end');
    }

    const { data, error } = await supabase
      .from('goal_spaces')
      .insert({
        name, description: description || null, parent_id: parentId,
        space_kind: 'cycle',
        edit_start_date: editStartDate,
        edit_end_date: editEndDate,
        rating_start_date: ratingStartDate,
        rating_deadline: ratingDeadline,
        is_active: true
      } as any)
      .select().single();
    if (error) throw error;
    await refetchSpaces();
    return toRow(data);
  }

  // goal_setting is auto-created via parent; disallow explicit creation here
  throw new Error('Goal Setting sub-space is auto-created with the parent');
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
  if (updatedSpace.editStartDate !== undefined) updateData.edit_start_date = updatedSpace.editStartDate;
  if (updatedSpace.editEndDate !== undefined) updateData.edit_end_date = updatedSpace.editEndDate;
  if (updatedSpace.ratingStartDate !== undefined) updateData.rating_start_date = updatedSpace.ratingStartDate;
  if (updatedSpace.ratingDeadline !== undefined) updateData.rating_deadline = updatedSpace.ratingDeadline;
  if (updatedSpace.isActive !== undefined) updateData.is_active = updatedSpace.isActive;

  const { error } = await supabase.from('goal_spaces').update(updateData).eq('id', spaceId);
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
  const { error } = await supabase.from('goal_spaces').delete().eq('id', spaceId);
  if (error) throw error;
  await refetchSpaces();
  return true;
};

interface SpacesParams { spaces: GoalSpace[] }

const goalSettingSpaces = (spaces: GoalSpace[]) => spaces.filter(s => s.spaceKind === 'goal_setting');
const cycleSpaces = (spaces: GoalSpace[]) => spaces.filter(s => s.spaceKind === 'cycle');

export const getActiveSpace = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return goalSettingSpaces(spaces).find(space =>
    space.isActive && space.startDate && space.submissionDeadline &&
    new Date(space.startDate) <= now && new Date(space.submissionDeadline) >= now
  );
};

// Members create goals only in Goal Setting spaces during start↔submission window
export const canCreateOrEditGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const s = spaces.find(x => x.id === spaceId);
  if (!s || s.spaceKind !== 'goal_setting' || !s.startDate || !s.submissionDeadline) return false;
  const now = new Date();
  return s.isActive && new Date(s.startDate) <= now && new Date(s.submissionDeadline) >= now;
};

// Managers review Goal Setting goals during submission↔review window
export const canReviewGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const s = spaces.find(x => x.id === spaceId);
  if (!s || s.spaceKind !== 'goal_setting' || !s.startDate || !s.reviewDeadline) return false;
  const now = new Date();
  return s.isActive && new Date(s.startDate) <= now && new Date(s.reviewDeadline) >= now;
};

// Members edit their cycle-copy goal progress during a cycle's edit window
export const canEditCycleGoal = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const s = spaces.find(x => x.id === spaceId);
  if (!s || s.spaceKind !== 'cycle' || !s.editStartDate || !s.editEndDate) return false;
  const now = new Date();
  return s.isActive && new Date(s.editStartDate) <= now && new Date(s.editEndDate) >= now;
};

export const canRateGoals = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  if (!spaceId) return false;
  const s = spaces.find(x => x.id === spaceId);
  if (!s || s.spaceKind !== 'cycle' || !s.ratingStartDate || !s.ratingDeadline) return false;
  const now = new Date();
  return s.isActive && new Date(s.ratingStartDate) <= now && new Date(s.ratingDeadline) >= now;
};

export const getAvailableSpaces = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return goalSettingSpaces(spaces).filter(space =>
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
  return goalSettingSpaces(spaces).filter(space =>
    space.isActive && space.submissionDeadline && space.reviewDeadline &&
    new Date(space.submissionDeadline) <= now && new Date(space.reviewDeadline) >= now
  );
};

export const getSpacesForRating = ({ spaces }: SpacesParams) => {
  const now = new Date();
  return cycleSpaces(spaces).filter(space =>
    space.isActive && space.ratingStartDate && space.ratingDeadline &&
    new Date(space.ratingStartDate) <= now && new Date(space.ratingDeadline) >= now
  );
};

export const getParentSpaces = ({ spaces }: SpacesParams) =>
  spaces.filter(s => s.spaceKind === 'parent').sort((a, b) => a.name.localeCompare(b.name));

export const getSubSpaces = ({ spaces, parentId }: { spaces: GoalSpace[]; parentId: string }) =>
  spaces.filter(s => s.parentId === parentId).sort((a, b) => {
    if (a.spaceKind === 'goal_setting' && b.spaceKind !== 'goal_setting') return -1;
    if (b.spaceKind === 'goal_setting' && a.spaceKind !== 'goal_setting') return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

export const isSpaceReadOnly = ({ spaces, spaceId, isAdmin }: { spaces: GoalSpace[]; spaceId?: string; isAdmin?: boolean }) => {
  if (isAdmin) return false;
  if (!spaceId) return true;
  const s = spaces.find(x => x.id === spaceId);
  if (!s) return true;
  if (s.spaceKind === 'goal_setting') {
    if (!s.submissionDeadline) return true;
    return !s.isActive || new Date(s.submissionDeadline) < new Date();
  }
  if (s.spaceKind === 'cycle') {
    if (!s.editEndDate) return true;
    const now = new Date();
    return !s.isActive || !s.editStartDate || new Date(s.editStartDate) > now || new Date(s.editEndDate) < now;
  }
  return true;
};


import { GoalSpace, GoalSpaceCountry, SpaceKind } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CreateGoalSpaceParams {
  name: string;
  description?: string;
  parentId?: string | null;
  spaceKind: SpaceKind;
  country?: GoalSpaceCountry;
  // goal_setting dates (also used when creating parent — parent is created first then its GS)
  startDate?: string | null;
  submissionDeadline?: string | null;
  reviewDeadline?: string | null;
  // cycle dates
  selfRatingStartDate?: string | null;
  selfRatingEndDate?: string | null;
  managerRatingStartDate?: string | null;
  managerRatingEndDate?: string | null;
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
  selfRatingStartDate: d.self_rating_start_date,
  selfRatingEndDate: d.self_rating_end_date,
  managerRatingStartDate: d.manager_rating_start_date,
  managerRatingEndDate: d.manager_rating_end_date,
  createdAt: d.created_at,
  isActive: d.is_active,
  country: (d.country || 'IN') as GoalSpaceCountry
}) as GoalSpace;

const SESSION_EXPIRED = 'Your session has expired. Please sign in again to save this sub-space.';
const ADMIN_ONLY = 'Only administrators can create or edit goal spaces.';

// Ensures there is still a valid signed-in admin before touching goal_spaces,
// so permission failures surface as plain language instead of a database error.
const assertAdminSession = async (user: any) => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error(SESSION_EXPIRED);
  if (!user || user.role !== 'admin') throw new Error(ADMIN_ONLY);
};

const friendlyError = (error: any, operation: 'manage' | 'create-cycle' = 'manage'): Error => {
  const message = String(error?.message || '');
  if (error?.code === '42501' || /row-level security/i.test(message)) {
    return new Error(
      operation === 'create-cycle'
        ? 'The sub-space could not be created because its approved goals or milestones could not be copied. Please try again.'
        : ADMIN_ONLY
    );
  }
  return error instanceof Error ? error : new Error(message || 'Something went wrong');
};

export const createGoalSpace = async ({
  name, description, parentId, spaceKind, country,
  startDate, submissionDeadline, reviewDeadline,
  selfRatingStartDate, selfRatingEndDate, managerRatingStartDate, managerRatingEndDate,
  user, refetchSpaces
}: CreateGoalSpaceParams): Promise<GoalSpace | null> => {
  await assertAdminSession(user);

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
      .insert({ name, description: description || null, space_kind: 'parent', country: country || 'IN', is_active: true } as any)
      .select().single();
    if (pErr) throw friendlyError(pErr);

    const { error: gsErr } = await supabase
      .from('goal_spaces')
      .insert({
        name: 'Goal Setting',
        description: 'Author and approve goals for this space',
        parent_id: parent.id,
        space_kind: 'goal_setting',
        country: country || 'IN',
        start_date: startDate,
        submission_deadline: submissionDeadline,
        review_deadline: reviewDeadline,
        is_active: true
      } as any);
    if (gsErr) {
      await supabase.from('goal_spaces').delete().eq('id', parent.id);
      throw friendlyError(gsErr);
    }

    await refetchSpaces();
    return toRow(parent);
  }

  if (spaceKind === 'cycle') {
    if (!parentId) throw new Error('Cycle spaces need a parent');
    if (!selfRatingStartDate || !selfRatingEndDate || !managerRatingStartDate || !managerRatingEndDate) {
      throw new Error('Sub-spaces require employee and manager rating dates');
    }
    const ss = new Date(selfRatingStartDate), se = new Date(selfRatingEndDate),
      ms = new Date(managerRatingStartDate), me = new Date(managerRatingEndDate);
    if (!(ss <= se && ms <= me && ss <= ms && se <= me)) {
      throw new Error('Manager rating must start and end on or after employee rating');
    }

    const { data: parentRow } = await supabase
      .from('goal_spaces')
      .select('country')
      .eq('id', parentId)
      .single();

    const { data, error } = await supabase
      .from('goal_spaces')
      .insert({
        name, description: description || null, parent_id: parentId,
        space_kind: 'cycle',
        country: (parentRow as any)?.country || 'IN',
        self_rating_start_date: selfRatingStartDate,
        self_rating_end_date: selfRatingEndDate,
        manager_rating_start_date: managerRatingStartDate,
        manager_rating_end_date: managerRatingEndDate,
        is_active: true
      } as any)
      .select().single();
    if (error) throw friendlyError(error, 'create-cycle');
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
  await assertAdminSession(user);

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
  if (updatedSpace.selfRatingStartDate !== undefined) updateData.self_rating_start_date = updatedSpace.selfRatingStartDate;
  if (updatedSpace.selfRatingEndDate !== undefined) updateData.self_rating_end_date = updatedSpace.selfRatingEndDate;
  if (updatedSpace.managerRatingStartDate !== undefined) updateData.manager_rating_start_date = updatedSpace.managerRatingStartDate;
  if (updatedSpace.managerRatingEndDate !== undefined) updateData.manager_rating_end_date = updatedSpace.managerRatingEndDate;
  if (updatedSpace.isActive !== undefined) updateData.is_active = updatedSpace.isActive;
  if (updatedSpace.country !== undefined) updateData.country = updatedSpace.country;

  const { error } = await supabase.from('goal_spaces').update(updateData).eq('id', spaceId);
  if (error) throw friendlyError(error);

  // Cascade a parent country change to all its sub-spaces
  if (updatedSpace.country !== undefined) {
    const { error: cErr } = await supabase
      .from('goal_spaces')
      .update({ country: updatedSpace.country } as any)
      .eq('parent_id', spaceId);
    if (cErr) throw friendlyError(cErr);
  }
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
  await assertAdminSession(user);
  const { error } = await supabase.from('goal_spaces').delete().eq('id', spaceId);
  if (error) throw friendlyError(error);
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

// Window check with an inclusive end day
export const isWithinWindow = (start?: string | null, end?: string | null, now = new Date()) => {
  if (!start || !end) return false;
  const e = new Date(end); e.setDate(e.getDate() + 1);
  return new Date(start) <= now && now < e;
};

// Cycle copies no longer have a progress-editing window
export const canEditCycleGoal = (_: { spaces: GoalSpace[]; spaceId?: string }) => false;

const findCycle = (spaces: GoalSpace[], spaceId?: string) => {
  const s = spaceId ? spaces.find(x => x.id === spaceId) : undefined;
  return s && s.spaceKind === 'cycle' && s.isActive ? s : undefined;
};

export const canSelfRate = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  const s = findCycle(spaces, spaceId);
  return !!s && isWithinWindow(s.selfRatingStartDate, s.selfRatingEndDate);
};

export const canManagerRate = ({ spaces, spaceId }: { spaces: GoalSpace[]; spaceId?: string }) => {
  const s = findCycle(spaces, spaceId);
  return !!s && isWithinWindow(s.managerRatingStartDate, s.managerRatingEndDate);
};

export const canRateGoals = (p: { spaces: GoalSpace[]; spaceId?: string }) => canSelfRate(p) || canManagerRate(p);

export type CyclePhase = { status: string; label: string; className: string };
export const getCyclePhase = (s: GoalSpace): CyclePhase | null => {
  if (!s.selfRatingStartDate || !s.selfRatingEndDate || !s.managerRatingStartDate || !s.managerRatingEndDate) return null;
  const now = new Date();
  if (now < new Date(s.selfRatingStartDate)) return { status: 'upcoming', label: 'Upcoming', className: 'bg-blue-100 text-blue-800' };
  const self = isWithinWindow(s.selfRatingStartDate, s.selfRatingEndDate, now);
  const mgr = isWithinWindow(s.managerRatingStartDate, s.managerRatingEndDate, now);
  if (self && mgr) return { status: 'rating', label: 'Self & manager rating open', className: 'bg-purple-100 text-purple-800' };
  if (self) return { status: 'self', label: 'Self-rating open', className: 'bg-green-100 text-green-800' };
  if (mgr) return { status: 'manager', label: 'Manager rating open', className: 'bg-purple-100 text-purple-800' };
  if (now < new Date(s.managerRatingStartDate)) return { status: 'waiting', label: 'Awaiting manager rating', className: 'bg-amber-100 text-amber-800' };
  return { status: 'completed', label: 'Completed', className: 'bg-gray-100 text-gray-800' };
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
    space.isActive && (isWithinWindow(space.selfRatingStartDate, space.selfRatingEndDate, now) ||
      isWithinWindow(space.managerRatingStartDate, space.managerRatingEndDate, now))
  );
};

export const getParentSpaces = ({ spaces }: SpacesParams) =>
  spaces.filter(s => s.spaceKind === 'parent').sort((a, b) => a.name.localeCompare(b.name));

export const getGoalSettingSpaceForParent = ({ spaces, parentId }: { spaces: GoalSpace[]; parentId: string }) =>
  spaces.find(s => s.parentId === parentId && s.spaceKind === 'goal_setting');

export const getParentSpacesOpenForCreation = ({ spaces, isAdmin }: { spaces: GoalSpace[]; isAdmin?: boolean }) => {
  const now = new Date();
  return spaces
    .filter(s => s.spaceKind === 'parent')
    .filter(parent => {
      const gs = spaces.find(x => x.parentId === parent.id && x.spaceKind === 'goal_setting');
      if (!gs || !gs.isActive || !gs.startDate || !gs.submissionDeadline) return false;
      if (isAdmin) return true;
      return new Date(gs.startDate) <= now && new Date(gs.submissionDeadline) >= now;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

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
    return true;
  }
  return true;
};

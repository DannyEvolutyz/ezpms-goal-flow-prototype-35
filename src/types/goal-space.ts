
export type SpaceKind = 'parent' | 'goal_setting' | 'cycle';

export interface GoalSpace {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  spaceKind: SpaceKind;
  // goal_setting uses these
  startDate?: string | null;
  submissionDeadline?: string | null;
  reviewDeadline?: string | null;
  // cycle uses these
  editStartDate?: string | null;
  editEndDate?: string | null;
  ratingStartDate?: string | null;
  ratingDeadline?: string | null;
  createdAt: string;
  isActive: boolean;
}

export const isParentSpace = (s: GoalSpace) => s.spaceKind === 'parent';
export const isGoalSettingSpace = (s: GoalSpace) => s.spaceKind === 'goal_setting';
export const isCycleSpace = (s: GoalSpace) => s.spaceKind === 'cycle';

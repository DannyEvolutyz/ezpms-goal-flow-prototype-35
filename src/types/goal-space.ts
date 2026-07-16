
export interface GoalSpace {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null; // null for parent (container) spaces
  startDate?: string | null;
  submissionDeadline?: string | null;
  reviewDeadline?: string | null;
  ratingStartDate?: string | null;
  ratingDeadline?: string | null;
  createdAt: string;
  isActive: boolean;
}

export const isParentSpace = (s: GoalSpace) => !s.parentId;
export const isSubSpace = (s: GoalSpace) => !!s.parentId;

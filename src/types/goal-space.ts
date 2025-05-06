
export interface GoalSpace {
  id: string;
  name: string;
  description?: string;
  startDate: string; // When the space becomes active
  submissionDeadline: string; // Last date users can create/edit goals
  reviewDeadline: string; // Last date managers can review goals
  createdAt: string;
  isActive: boolean;
}

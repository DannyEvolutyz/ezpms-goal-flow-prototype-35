
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed?: boolean; // optional, defaults to false for old data
  targetDate?: string; // milestone-specific deadlines
  // for future: status, due date, etc.
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'under_review';
  feedback?: string;
  reviewerId?: string; // ID of the user who reviewed the goal
  milestones?: Milestone[];
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones?: Milestone[];
}

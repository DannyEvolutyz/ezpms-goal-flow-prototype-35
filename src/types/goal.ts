
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  completionComment?: string;
  targetDate?: string;
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
  reviewerId?: string;
  milestones?: Milestone[];
  weightage: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones?: Milestone[];
}

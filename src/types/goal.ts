
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
  spaceId: string; // Adding spaceId to the Goal interface
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'submitted' | 'under_review' | 'final_approved';
  feedback?: string;
  reviewerId?: string;
  milestones?: Milestone[];
  weightage: number;
  rating?: number;
  ratingComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  createdBy: string;
  isActive: boolean;
  milestones?: Milestone[];
}

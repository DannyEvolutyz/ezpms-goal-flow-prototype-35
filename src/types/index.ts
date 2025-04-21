
export type UserRole = 'admin' | 'manager' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  teamMembers?: string[];
  photoUrl?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'under_review';
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  feedback: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  targetDate?: string;
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones?: Milestone[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  isRead: boolean;
  targetType?: 'goal' | 'user';
  targetId?: string;
}

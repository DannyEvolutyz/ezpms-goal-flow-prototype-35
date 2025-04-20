
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  photoUrl?: string;
  managerId?: string;
  teamMembers?: string[]; // IDs of users reporting to this user
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
  milestones?: Milestone[]; // <-- add this line
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  // future: status, due date, etc
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones?: Milestone[]; // <-- new
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  targetId?: string;
  targetType?: string;
}

// User role type alias
export type UserRole = 'admin' | 'manager' | 'member';


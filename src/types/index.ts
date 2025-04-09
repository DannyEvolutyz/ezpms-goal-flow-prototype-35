
export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string; // Only for employees
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  feedback?: string;
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
}

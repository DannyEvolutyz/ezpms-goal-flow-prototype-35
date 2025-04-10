
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  photoUrl?: string;
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
}

export interface GoalBank {
  id: string;
  title: string;
  description: string;
  category: string;
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

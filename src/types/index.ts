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

export * from './goal';

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

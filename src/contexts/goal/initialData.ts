
import { Goal, GoalBank, Notification } from '@/types';

export const initialGoals: Goal[] = [];

export const initialGoalBank: GoalBank[] = [
  {
    id: 'template-1',
    title: 'Improve Technical Skills',
    description: 'Enhance your technical capabilities in your area of expertise',
    category: 'Technical Skills',
    targetAudience: 'All',
    createdBy: 'admin',
    isActive: true,
    milestones: [
      { id: 'milestone-1', title: 'Complete online course', completed: false },
      { id: 'milestone-2', title: 'Apply skills in project', completed: false },
      { id: 'milestone-3', title: 'Get peer review', completed: false }
    ]
  },
  {
    id: 'template-2',
    title: 'Leadership Development',
    description: 'Develop leadership skills and team management capabilities',
    category: 'Leadership',
    targetAudience: 'Managers',
    createdBy: 'admin',
    isActive: true,
    milestones: [
      { id: 'milestone-4', title: 'Complete leadership training', completed: false },
      { id: 'milestone-5', title: 'Lead a project team', completed: false },
      { id: 'milestone-6', title: 'Receive 360 feedback', completed: false }
    ]
  },
  {
    id: 'template-3',
    title: 'Customer Service Excellence',
    description: 'Enhance customer service skills and customer satisfaction',
    category: 'Customer Service',
    targetAudience: 'Customer-facing roles',
    createdBy: 'admin',
    isActive: true,
    milestones: [
      { id: 'milestone-7', title: 'Complete customer service training', completed: false },
      { id: 'milestone-8', title: 'Achieve customer satisfaction target', completed: false },
      { id: 'milestone-9', title: 'Handle escalations effectively', completed: false }
    ]
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notification-1',
    userId: 'user-1',
    title: 'Welcome to EzPMS! 🎉',
    message: 'Welcome to the Goal Management System. Start by creating your first goal in the Goals section.',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    targetType: 'goal'
  },
  {
    id: 'notification-2',
    userId: 'user-2',
    title: 'Welcome to EzPMS! 🎉',
    message: 'Welcome to the Goal Management System. Start by creating your first goal in the Goals section.',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    targetType: 'goal'
  },
  {
    id: 'notification-3',
    userId: 'manager-1',
    title: 'Manager Dashboard Available',
    message: 'As a manager, you now have access to the Manager Dashboard to review team goals.',
    type: 'info',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false
  },
  {
    id: 'notification-4',
    userId: 'admin-1',
    title: 'Admin Access Granted',
    message: 'You have full administrative access to manage goal spaces, templates, and user permissions.',
    type: 'success',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false
  },
  {
    id: 'notification-5',
    userId: 'user-1',
    title: 'Goal Submission Reminder',
    message: 'Don\'t forget to submit your annual goals before the deadline: February 15, 2025.',
    type: 'warning',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    isRead: false,
    targetType: 'goal'
  }
];

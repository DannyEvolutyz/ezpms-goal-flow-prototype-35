
import { Goal, GoalBank, Notification } from '@/types';

// Mock goal templates for the goal bank
export const initialGoalBank: GoalBank[] = [
  {
    id: 'template1',
    title: 'Improve Technical Skills in React',
    description: 'Complete an advanced React course and build a sample project showcasing new skills',
    category: 'Technical Skills',
  },
  {
    id: 'template2',
    title: 'Enhance Leadership Abilities',
    description: 'Lead a team project and organize bi-weekly team building activities',
    category: 'Leadership',
  },
  {
    id: 'template3',
    title: 'Professional Development Certification',
    description: 'Obtain a professional certification relevant to current role',
    category: 'Professional Development',
  },
  {
    id: 'template4',
    title: 'Create an Innovative Solution',
    description: 'Develop a new approach or tool to address a business challenge',
    category: 'Innovation',
  },
  {
    id: 'template5',
    title: 'Mentor Junior Teammates',
    description: 'Provide mentorship to at least two junior team members through regular 1:1 sessions',
    category: 'Leadership',
  },
];

// Initial mock goals data - extended with some example goals for the manager dashboard
export const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'emp-1',
    title: 'Learn Advanced TypeScript',
    description: 'Complete TypeScript certification and apply knowledge in current project',
    category: 'Technical Skills',
    priority: 'high',
    targetDate: '2025-06-30',
    status: 'submitted'
  },
  {
    id: 'goal-2',
    userId: 'emp-2',
    title: 'Improve Team Communication',
    description: 'Implement bi-weekly team sync meetings and create documentation standards',
    category: 'Leadership',
    priority: 'medium',
    targetDate: '2025-05-15',
    status: 'submitted'
  }
];

// Initial notifications
export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'emp-1',
    title: 'Goal Submitted',
    message: 'Your goal "Learn Advanced TypeScript" has been submitted for approval',
    type: 'info',
    isRead: false,
    timestamp: new Date().toISOString(),
    targetId: 'goal-1',
    targetType: 'goal'
  },
  {
    id: 'notif-2',
    userId: 'manager-1',
    title: 'New Goal Submission',
    message: 'Employee has submitted a new goal for your review',
    type: 'info',
    isRead: false,
    timestamp: new Date().toISOString(),
    targetId: 'goal-1',
    targetType: 'goal'
  }
];

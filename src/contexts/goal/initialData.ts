
import { Goal, GoalBank, Notification } from '@/types';

// Predefined goal templates
export const initialGoalBank: GoalBank[] = [
  {
    id: 'template-1',
    title: 'Improve Technical Skills',
    description: 'Focus on enhancing technical abilities in specific areas',
    category: 'Technical Skills',
    milestones: [
      {
        id: 'ms-1-1',
        title: 'Complete online course',
        description: 'Finish an online course in the chosen technical area'
      },
      {
        id: 'ms-1-2',
        title: 'Apply knowledge in a project',
        description: 'Use the newly acquired skills in a practical project'
      },
      {
        id: 'ms-1-3',
        title: 'Present findings to team',
        description: 'Share knowledge with colleagues in a presentation'
      }
    ]
  },
  {
    id: 'template-2',
    title: 'Leadership Development',
    description: 'Develop leadership skills to prepare for management roles',
    category: 'Leadership',
    milestones: [
      {
        id: 'ms-2-1',
        title: 'Lead a small team project',
        description: 'Take initiative in leading a small team for a project'
      },
      {
        id: 'ms-2-2',
        title: 'Mentor a junior colleague',
        description: 'Provide mentorship to help a junior team member grow'
      },
      {
        id: 'ms-2-3',
        title: 'Complete leadership training',
        description: 'Attend leadership training sessions or workshops'
      }
    ]
  },
  {
    id: 'template-3',
    title: 'Improve Communication Skills',
    description: 'Enhance written and verbal communication abilities',
    category: 'Professional Development',
    milestones: [
      {
        id: 'ms-3-1',
        title: 'Practice public speaking',
        description: 'Give presentations to improve public speaking skills'
      },
      {
        id: 'ms-3-2',
        title: 'Improve documentation',
        description: 'Focus on writing clear and concise documentation'
      },
      {
        id: 'ms-3-3',
        title: 'Enhance team communication',
        description: 'Work on effective communication within the team'
      }
    ]
  }
];

// Initial sample goals
export const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'member-1',
    title: 'Master React and TypeScript',
    description: 'Improve skills in React and TypeScript for front-end development',
    category: 'Technical Skills',
    priority: 'high',
    status: 'approved',
    targetDate: '2025-05-15',
    createdAt: '2025-01-10T08:30:00Z',
    updatedAt: '2025-01-15T10:20:00Z',
    feedback: 'Great goal! Focus on practical projects.',
    milestones: [
      {
        id: 'ms-goal1-1',
        title: 'Complete Advanced React Course',
        description: 'Finish the online course on advanced React concepts',
        completed: true,
        targetDate: '2025-02-20'
      },
      {
        id: 'ms-goal1-2',
        title: 'Build a TypeScript Project',
        description: 'Create a small application using TypeScript',
        completed: false,
        targetDate: '2025-03-30'
      },
      {
        id: 'ms-goal1-3',
        title: 'Contribute to Open Source',
        description: 'Make a contribution to an open-source React project',
        completed: false,
        targetDate: '2025-04-25'
      }
    ]
  },
  {
    id: 'goal-2',
    userId: 'member-1',
    title: 'Improve Code Review Skills',
    description: 'Become more effective at reviewing code and providing constructive feedback',
    category: 'Professional Development',
    priority: 'medium',
    status: 'submitted',
    targetDate: '2025-06-30',
    createdAt: '2025-01-20T14:45:00Z',
    updatedAt: '2025-01-20T14:45:00Z',
    feedback: '',
    milestones: [
      {
        id: 'ms-goal2-1',
        title: 'Review 5 Pull Requests Weekly',
        description: 'Consistently review at least 5 PRs each week',
        completed: false,
        targetDate: '2025-02-28'
      },
      {
        id: 'ms-goal2-2',
        title: 'Study Code Review Best Practices',
        description: 'Read articles and books on effective code reviewing',
        completed: false,
        targetDate: '2025-03-15'
      }
    ]
  },
  {
    id: 'goal-3',
    userId: 'member-2',
    title: 'Learn Cloud Computing',
    description: 'Gain knowledge and skills in cloud platforms and services',
    category: 'Technical Skills',
    priority: 'high',
    status: 'approved',
    targetDate: '2025-07-15',
    createdAt: '2025-01-05T09:15:00Z',
    updatedAt: '2025-01-10T11:30:00Z',
    feedback: 'Approved. This aligns well with our cloud migration strategy.',
    milestones: [
      {
        id: 'ms-goal3-1',
        title: 'Complete AWS Certification',
        description: 'Obtain AWS Solutions Architect certification',
        completed: true,
        targetDate: '2025-03-15'
      },
      {
        id: 'ms-goal3-2',
        title: 'Implement Serverless Project',
        description: 'Create a serverless application using AWS Lambda',
        completed: false,
        targetDate: '2025-05-20'
      }
    ]
  },
  {
    id: 'goal-4',
    userId: 'member-4',
    title: 'Develop Leadership Skills',
    description: 'Work on improving team leadership and management abilities',
    category: 'Leadership',
    priority: 'medium',
    status: 'draft',
    targetDate: '2025-09-01',
    createdAt: '2025-01-25T16:20:00Z',
    updatedAt: '2025-01-25T16:20:00Z',
    feedback: '',
    milestones: [
      {
        id: 'ms-goal4-1',
        title: 'Lead Team Meeting',
        description: 'Take initiative to lead weekly team meetings',
        completed: false,
        targetDate: '2025-02-28'
      },
      {
        id: 'ms-goal4-2',
        title: 'Mentor Junior Developer',
        description: 'Provide mentorship to one junior team member',
        completed: false,
        targetDate: '2025-04-30'
      },
      {
        id: 'ms-goal4-3',
        title: 'Organize Team Building Event',
        description: 'Plan and execute a team building activity',
        completed: false,
        targetDate: '2025-06-15'
      }
    ]
  },
  {
    id: 'goal-5',
    userId: 'member-5',
    title: 'Improve Testing Practices',
    description: 'Enhance knowledge and implementation of testing methodologies',
    category: 'Technical Skills',
    priority: 'medium',
    status: 'rejected',
    targetDate: '2025-08-15',
    createdAt: '2025-01-15T10:45:00Z',
    updatedAt: '2025-01-18T09:30:00Z',
    feedback: 'Please be more specific about which testing frameworks you plan to focus on.',
    milestones: [
      {
        id: 'ms-goal5-1',
        title: 'Increase Test Coverage',
        description: 'Improve test coverage to at least 80%',
        completed: false,
        targetDate: '2025-03-30'
      },
      {
        id: 'ms-goal5-2',
        title: 'Implement Integration Tests',
        description: 'Add integration tests to critical features',
        completed: false,
        targetDate: '2025-05-15'
      }
    ]
  }
];

// Initial notifications
export const initialNotifications: Notification[] = [
  {
    id: 'notification-1',
    userId: 'member-1',
    title: 'Goal Approved',
    message: 'Your goal "Master React and TypeScript" has been approved by your manager.',
    type: 'success',
    timestamp: '2025-01-15T10:20:00Z',
    isRead: false,
    targetType: 'goal',
    targetId: 'goal-1'
  },
  {
    id: 'notification-2',
    userId: 'member-5',
    title: 'Goal Rejected',
    message: 'Your goal "Improve Testing Practices" has been rejected. Please review the feedback.',
    type: 'error',
    timestamp: '2025-01-18T09:30:00Z',
    isRead: false,
    targetType: 'goal',
    targetId: 'goal-5'
  },
  {
    id: 'notification-3',
    userId: 'manager-1',
    title: 'New Goal Submitted',
    message: 'Hema has submitted a goal "Improve Code Review Skills" for your review.',
    type: 'info',
    timestamp: '2025-01-20T14:45:00Z',
    isRead: false,
    targetType: 'goal',
    targetId: 'goal-2'
  }
];

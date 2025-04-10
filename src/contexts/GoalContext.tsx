
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Goal, GoalBank, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Mock goal templates for the goal bank
const initialGoalBank: GoalBank[] = [
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
const initialGoals: Goal[] = [
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
const initialNotifications: Notification[] = [
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

interface GoalContextType {
  goals: Goal[];
  goalBank: GoalBank[];
  notifications: Notification[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => void;
  updateGoal: (goal: Goal) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string) => void;
  rejectGoal: (goalId: string, feedback: string) => void;
  returnGoalForRevision: (goalId: string, feedback: string) => void;
  deleteGoal: (goalId: string) => void;
  getGoalsByStatus: (status: Goal['status']) => Goal[];
  getTeamGoals: () => Goal[];
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationsCount: () => number;
  getUserNotifications: () => Notification[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [goalBank] = useState<GoalBank[]>(initialGoalBank);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { user } = useAuth();

  // Create a new notification
  const createNotification = (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    targetId?: string,
    targetType?: string
  ) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString(),
      targetId,
      targetType
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  // Add a new goal (in draft state)
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>) => {
    if (!user) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: user.id,
      status: 'draft',
      ...goalData,
    };

    setGoals(prevGoals => [...prevGoals, newGoal]);
    createNotification(
      user.id,
      'Goal Created',
      `You've created a new goal: "${newGoal.title}"`,
      'info',
      newGoal.id,
      'goal'
    );
    toast.success('Goal created successfully');
  };

  // Update an existing goal
  const updateGoal = (updatedGoal: Goal) => {
    if (!user) return;

    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
    
    createNotification(
      user.id,
      'Goal Updated',
      `Your goal "${updatedGoal.title}" has been updated`,
      'info',
      updatedGoal.id,
      'goal'
    );
    
    toast.success('Goal updated successfully');
  };

  // Submit a goal for review (change status from draft to submitted)
  const submitGoal = (goalId: string) => {
    if (!user) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    // Determine if this is a resubmission
    const isResubmission = goal.status === 'rejected' || goal.status === 'under_review';
    
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'submitted', feedback: undefined } // Clear feedback on resubmission
          : goal
      )
    );
    
    // Create notification for the employee
    createNotification(
      user.id,
      isResubmission ? 'Goal Resubmitted' : 'Goal Submitted',
      isResubmission 
        ? `Your goal "${goal.title}" has been resubmitted for approval`
        : `Your goal "${goal.title}" has been submitted for approval`,
      'info',
      goalId,
      'goal'
    );
    
    // Create notification for the manager (in a real app, you'd send this to the right manager)
    const managerIds = ['manager-1']; // Mock manager ID
    managerIds.forEach(managerId => {
      createNotification(
        managerId,
        isResubmission ? 'Goal Resubmitted' : 'New Goal Submission',
        isResubmission
          ? `${user.name} has resubmitted a goal for your review`
          : `${user.name} has submitted a new goal for your review`,
        'info',
        goalId,
        'goal'
      );
    });
    
    toast.success(isResubmission ? 'Goal resubmitted successfully' : 'Goal submitted for approval');
  };

  // Manager: Approve a goal
  const approveGoal = (goalId: string) => {
    if (!user || user.role !== 'manager') return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'approved' } 
          : goal
      )
    );
    
    // Create notification for the manager
    createNotification(
      user.id,
      'Goal Approved',
      `You've approved the goal: "${goal.title}"`,
      'success',
      goalId,
      'goal'
    );
    
    // Create notification for the employee
    createNotification(
      goal.userId,
      'Goal Approved',
      `Your goal "${goal.title}" has been approved by your manager`,
      'success',
      goalId,
      'goal'
    );
    
    toast.success('Goal approved');
  };

  // Manager: Reject a goal with feedback
  const rejectGoal = (goalId: string, feedback: string) => {
    if (!user || user.role !== 'manager') return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'rejected', feedback } 
          : goal
      )
    );
    
    // Create notification for the manager
    createNotification(
      user.id,
      'Goal Rejected',
      `You've rejected the goal: "${goal.title}"`,
      'warning',
      goalId,
      'goal'
    );
    
    // Create notification for the employee
    createNotification(
      goal.userId,
      'Goal Rejected',
      `Your goal "${goal.title}" has been rejected. Please review the feedback.`,
      'error',
      goalId,
      'goal'
    );
    
    toast.success('Goal rejected with feedback');
  };

  // Manager: Return a goal for revision with feedback
  const returnGoalForRevision = (goalId: string, feedback: string) => {
    if (!user || user.role !== 'manager') return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'under_review', feedback } 
          : goal
      )
    );
    
    // Create notification for the manager
    createNotification(
      user.id,
      'Goal Returned',
      `You've returned the goal: "${goal.title}" for revisions`,
      'info',
      goalId,
      'goal'
    );
    
    // Create notification for the employee
    createNotification(
      goal.userId,
      'Goal Needs Revision',
      `Your goal "${goal.title}" needs revisions. Please review the feedback.`,
      'warning',
      goalId,
      'goal'
    );
    
    toast.success('Goal returned for revision');
  };

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    if (!user) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    // Only allow deletion if user owns the goal and it's in draft state
    if (goal.userId !== user.id || goal.status !== 'draft') return;
    
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    
    createNotification(
      user.id,
      'Goal Deleted',
      `You've deleted the goal: "${goal.title}"`,
      'info'
    );
    
    toast.success('Goal deleted successfully');
  };

  // Get goals filtered by status
  const getGoalsByStatus = (status: Goal['status']) => {
    if (!user) return [];
    return goals.filter(goal => goal.userId === user.id && goal.status === status);
  };

  // Get team goals (for managers)
  const getTeamGoals = () => {
    if (!user || user.role !== 'manager') return [];
    // In a real app, this would filter goals by employeeIds who report to this manager
    // For now, we'll return all goals except those belonging to the current user
    return goals.filter(goal => goal.userId !== user.id);
  };

  // Notification related methods
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const clearNotifications = () => {
    if (!user) return;
    setNotifications(prev => 
      prev.map(notification => 
        notification.userId === user.id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const getUnreadNotificationsCount = () => {
    if (!user) return 0;
    return notifications.filter(
      notification => notification.userId === user.id && !notification.isRead
    ).length;
  };

  const getUserNotifications = () => {
    if (!user) return [];
    return notifications
      .filter(notification => notification.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const value = {
    goals,
    goalBank,
    notifications,
    addGoal,
    updateGoal,
    submitGoal,
    approveGoal,
    rejectGoal,
    returnGoalForRevision,
    deleteGoal,
    getGoalsByStatus,
    getTeamGoals,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount,
    getUserNotifications,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

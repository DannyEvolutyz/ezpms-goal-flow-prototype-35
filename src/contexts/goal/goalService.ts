
import { Goal, Notification, User } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { createNotification } from './notificationService';

export const addGoal = (
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'feedback'>,
  userId: string,
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    userId,
    status: 'draft',
    ...goalData,
  };

  setGoals(prevGoals => [...prevGoals, newGoal]);
  createNotification(
    setNotifications,
    userId,
    'Goal Created',
    `You've created a new goal: "${newGoal.title}"`,
    'info',
    newGoal.id,
    'goal'
  );
  
  toast.success('Goal created successfully');
  return newGoal;
};

export const updateGoal = (
  updatedGoal: Goal,
  userId: string,
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    )
  );
  
  createNotification(
    setNotifications,
    userId,
    'Goal Updated',
    `Your goal "${updatedGoal.title}" has been updated`,
    'info',
    updatedGoal.id,
    'goal'
  );
  
  toast.success('Goal updated successfully');
};

export const submitGoal = (
  goalId: string,
  userId: string,
  userName: string,
  goals: Goal[],
  currentUser: User,
  allUsers: User[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
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
  
  // Create notification for the submitter
  createNotification(
    setNotifications,
    userId,
    isResubmission ? 'Goal Resubmitted' : 'Goal Submitted',
    isResubmission 
      ? `Your goal "${goal.title}" has been resubmitted for approval`
      : `Your goal "${goal.title}" has been submitted for approval`,
    'info',
    goalId,
    'goal'
  );
  
  // Get the user's manager or an admin if the user is a manager
  let reviewerIds: string[] = [];
  
  if (currentUser.role === 'manager') {
    // If user is a manager, send to admins
    reviewerIds = allUsers.filter(u => u.role === 'admin').map(u => u.id);
  } else if (currentUser.managerId) {
    // If user has a manager, send to their manager
    reviewerIds = [currentUser.managerId];
  }
  
  // Create notification for the reviewers
  reviewerIds.forEach(reviewerId => {
    const reviewer = allUsers.find(u => u.id === reviewerId);
    if (!reviewer) return;
    
    createNotification(
      setNotifications,
      reviewerId,
      isResubmission ? 'Goal Resubmitted' : 'New Goal Submission',
      isResubmission
        ? `${userName} has resubmitted a goal for your review`
        : `${userName} has submitted a new goal for your review`,
      'info',
      goalId,
      'goal'
    );
  });
  
  toast.success(isResubmission ? 'Goal resubmitted successfully' : 'Goal submitted for approval');
};

export const approveGoal = (
  goalId: string,
  reviewerId: string,
  reviewerName: string,
  goals: Goal[],
  allUsers: User[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'approved', reviewerId } 
        : goal
    )
  );
  
  // Create notification for the reviewer
  createNotification(
    setNotifications,
    reviewerId,
    'Goal Approved',
    `You've approved the goal: "${goal.title}"`,
    'success',
    goalId,
    'goal'
  );
  
  // Create notification for the owner
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Approved',
    `Your goal "${goal.title}" has been approved by ${reviewerName}`,
    'success',
    goalId,
    'goal'
  );
  
  toast.success('Goal approved');
};

export const rejectGoal = (
  goalId: string,
  feedback: string,
  reviewerId: string,
  reviewerName: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'rejected', feedback, reviewerId } 
        : goal
    )
  );
  
  // Create notification for the reviewer
  createNotification(
    setNotifications,
    reviewerId,
    'Goal Rejected',
    `You've rejected the goal: "${goal.title}"`,
    'warning',
    goalId,
    'goal'
  );
  
  // Create notification for the owner
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Rejected',
    `Your goal "${goal.title}" has been rejected by ${reviewerName}. Please review the feedback.`,
    'error',
    goalId,
    'goal'
  );
  
  toast.success('Goal rejected with feedback');
};

export const returnGoalForRevision = (
  goalId: string,
  feedback: string,
  reviewerId: string,
  reviewerName: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  setGoals(prevGoals => 
    prevGoals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'under_review', feedback, reviewerId } 
        : goal
    )
  );
  
  // Create notification for the reviewer
  createNotification(
    setNotifications,
    reviewerId,
    'Goal Returned',
    `You've returned the goal: "${goal.title}" for revisions`,
    'info',
    goalId,
    'goal'
  );
  
  // Create notification for the owner
  createNotification(
    setNotifications,
    goal.userId,
    'Goal Needs Revision',
    `Your goal "${goal.title}" needs revisions from ${reviewerName}. Please review the feedback.`,
    'warning',
    goalId,
    'goal'
  );
  
  toast.success('Goal returned for revision');
};

export const deleteGoal = (
  goalId: string,
  userId: string,
  goals: Goal[],
  setGoals: Dispatch<SetStateAction<Goal[]>>,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  // Only allow deletion if user owns the goal and it's in draft state
  if (goal.userId !== userId || goal.status !== 'draft') return;
  
  setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  
  createNotification(
    setNotifications,
    userId,
    'Goal Deleted',
    `You've deleted the goal: "${goal.title}"`,
    'info'
  );
  
  toast.success('Goal deleted successfully');
};

export const getGoalsByStatus = (status: Goal['status'], userId: string, goals: Goal[]) => {
  return goals.filter(goal => goal.userId === userId && goal.status === status);
};

export const getGoalsForReview = (reviewerId: string, goals: Goal[], allUsers: User[]) => {
  const userRole = allUsers.find(u => u.id === reviewerId)?.role;
  
  if (userRole === 'admin') {
    // Admins can review goals from managers
    const managerIds = allUsers.filter(u => u.role === 'manager').map(u => u.id);
    return goals.filter(goal => 
      goal.status === 'submitted' && 
      managerIds.includes(goal.userId)
    );
  } else if (userRole === 'manager') {
    // Managers can review goals from their team members
    const teamMemberIds = allUsers
      .filter(u => u.managerId === reviewerId)
      .map(u => u.id);
    
    return goals.filter(goal => 
      goal.status === 'submitted' && 
      teamMemberIds.includes(goal.userId)
    );
  }
  
  return [];
};

export const getTeamGoals = (userId: string, goals: Goal[], allUsers: User[]) => {
  const user = allUsers.find(u => u.id === userId);
  
  if (!user) return [];
  
  if (user.role === 'admin') {
    // Admins can see all goals
    return goals;
  } else if (user.role === 'manager') {
    // Managers can see goals from their team members
    const teamMemberIds = allUsers
      .filter(u => u.managerId === userId)
      .map(u => u.id);
    
    return goals.filter(goal => teamMemberIds.includes(goal.userId));
  }
  
  // Regular members can only see their own goals (handled elsewhere)
  return [];
};

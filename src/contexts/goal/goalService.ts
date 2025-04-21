
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface GetGoalsByStatusParams {
  goals: Goal[];
  status: string;
  user: any;
}

export const getGoalsByStatus = ({
  goals,
  status,
  user
}: GetGoalsByStatusParams) => {
  if (!user) return [];
  
  return goals.filter(goal => 
    goal.userId === user.id && goal.status === status
  );
};

interface GetTeamGoalsParams {
  goals: Goal[];
  user: any;
  getAllUsers: () => any[];
}

export const getTeamGoals = ({
  goals,
  user,
  getAllUsers
}: GetTeamGoalsParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return [];
  
  const allUsers = getAllUsers();
  
  // If user is admin, get all goals
  if (user.role === 'admin') {
    return goals;
  }
  
  // If user is manager, get goals of team members
  const teamMemberIds = allUsers
    .filter(u => u.managerId === user.id)
    .map(u => u.id);
  
  return goals.filter(goal => teamMemberIds.includes(goal.userId));
};

export const getGoalsForReview = () => {
  // Implementation for getting goals that need review
  return [];
};

interface AddGoalParams {
  goals: Goal[];
  goalData: Omit<Goal, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'feedback'>;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
}

export const addGoal = ({
  goals,
  goalData,
  user,
  setGoals,
  setNotifications,
  createNotification
}: AddGoalParams) => {
  if (!user) return null;
  
  const newGoal: Goal = {
    ...goalData,
    id: `goal-${Date.now()}`,
    userId: user.id,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedback: '',
    milestones: goalData.milestones || []
  };
  
  setGoals(prev => [...prev, newGoal]);
  
  createNotification({
    userId: user.id,
    title: 'Goal Created',
    message: `You created a new goal: ${newGoal.title}`,
    type: 'success',
    setNotifications,
  });
  
  return newGoal;
};

interface UpdateGoalParams {
  goals: Goal[];
  updatedGoal: Goal;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
}

export const updateGoal = ({
  goals,
  updatedGoal,
  setGoals
}: UpdateGoalParams) => {
  setGoals(prev => 
    prev.map(goal => 
      goal.id === updatedGoal.id ? {
        ...updatedGoal,
        updatedAt: new Date().toISOString()
      } : goal
    )
  );
  
  return updatedGoal;
};

interface SubmitGoalParams {
  goals: Goal[];
  goalId: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  getAllUsers: () => any[];
}

export const submitGoal = ({
  goals,
  goalId,
  user,
  setGoals,
  setNotifications,
  createNotification,
  getAllUsers
}: SubmitGoalParams) => {
  if (!user) return;
  
  const goalToSubmit = goals.find(g => g.id === goalId);
  
  if (!goalToSubmit || goalToSubmit.userId !== user.id) return;
  
  // Update goal status
  setGoals(prev => 
    prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            status: 'submitted',
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  );
  
  // Create notification for the user
  createNotification({
    userId: user.id,
    title: 'Goal Submitted',
    message: `You've submitted your goal: ${goalToSubmit.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  // Create notification for the manager
  const allUsers = getAllUsers();
  const manager = allUsers.find(u => u.id === user.managerId);
  
  if (manager) {
    createNotification({
      userId: manager.id,
      title: 'Goal Submitted for Review',
      message: `${user.name} has submitted a goal for your review: ${goalToSubmit.title}`,
      type: 'info',
      targetType: 'goal',
      targetId: goalId,
      setNotifications
    });
  }
};

interface ApproveGoalParams {
  goals: Goal[];
  goalId: string;
  feedback: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  getAllUsers: () => any[];
}

export const approveGoal = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification,
  getAllUsers
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToApprove = goals.find(g => g.id === goalId);
  
  if (!goalToApprove) return;
  
  // Update goal status
  setGoals(prev => 
    prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            status: 'approved',
            feedback,
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  );
  
  // Create notification for the employee
  createNotification({
    userId: goalToApprove.userId,
    title: 'Goal Approved',
    message: `Your goal "${goalToApprove.title}" has been approved${feedback ? '. See feedback for details.' : ''}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  // Create notification for the manager
  createNotification({
    userId: user.id,
    title: 'Goal Approved',
    message: `You've approved the goal: ${goalToApprove.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
};

interface RejectGoalParams {
  goals: Goal[];
  goalId: string;
  feedback: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  getAllUsers: () => any[];
}

export const rejectGoal = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification,
  getAllUsers
}: RejectGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReject = goals.find(g => g.id === goalId);
  
  if (!goalToReject) return;
  
  // Update goal status
  setGoals(prev => 
    prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            status: 'rejected',
            feedback,
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  );
  
  // Create notification for the employee
  createNotification({
    userId: goalToReject.userId,
    title: 'Goal Rejected',
    message: `Your goal "${goalToReject.title}" has been rejected. Please check the feedback.`,
    type: 'error',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  // Create notification for the manager
  createNotification({
    userId: user.id,
    title: 'Goal Rejected',
    message: `You've rejected the goal: ${goalToReject.title}`,
    type: 'info',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
};

interface ReturnGoalForRevisionParams {
  goals: Goal[];
  goalId: string;
  feedback: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
  getAllUsers: () => any[];
}

export const returnGoalForRevision = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification,
  getAllUsers
}: ReturnGoalForRevisionParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReturn = goals.find(g => g.id === goalId);
  
  if (!goalToReturn) return;
  
  // Update goal status
  setGoals(prev => 
    prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            status: 'under_review',
            feedback,
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  );
  
  // Create notification for the employee
  createNotification({
    userId: goalToReturn.userId,
    title: 'Goal Needs Revision',
    message: `Your goal "${goalToReturn.title}" requires revision. Please check the feedback.`,
    type: 'warning',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  // Create notification for the manager
  createNotification({
    userId: user.id,
    title: 'Goal Returned for Revision',
    message: `You've returned the goal for revision: ${goalToReturn.title}`,
    type: 'info',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
};

interface DeleteGoalParams {
  goals: Goal[];
  goalId: string;
  user: any;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setNotifications: Dispatch<SetStateAction<any[]>>;
  createNotification: (params: any) => void;
}

export const deleteGoal = ({
  goals,
  goalId,
  user,
  setGoals,
  setNotifications,
  createNotification
}: DeleteGoalParams) => {
  if (!user) return;
  
  const goalToDelete = goals.find(g => g.id === goalId);
  
  if (!goalToDelete || (goalToDelete.userId !== user.id && user.role !== 'admin')) return;
  
  // Delete the goal
  setGoals(prev => prev.filter(goal => goal.id !== goalId));
  
  // Create notification
  createNotification({
    userId: user.id,
    title: 'Goal Deleted',
    message: `Goal "${goalToDelete.title}" has been deleted`,
    type: 'info',
    setNotifications
  });
};

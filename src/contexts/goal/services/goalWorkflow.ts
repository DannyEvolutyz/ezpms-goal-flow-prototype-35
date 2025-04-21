
import { Goal } from '@/types';
import { Dispatch, SetStateAction } from 'react';

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
  
  createNotification({
    userId: user.id,
    title: 'Goal Submitted',
    message: `You've submitted your goal: ${goalToSubmit.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
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
}

export const approveGoal = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToApprove = goals.find(g => g.id === goalId);
  
  if (!goalToApprove) return;
  
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
  
  createNotification({
    userId: goalToApprove.userId,
    title: 'Goal Approved',
    message: `Your goal "${goalToApprove.title}" has been approved${feedback ? '. See feedback for details.' : ''}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
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

export const rejectGoal = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReject = goals.find(g => g.id === goalId);
  
  if (!goalToReject) return;
  
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
  
  createNotification({
    userId: goalToReject.userId,
    title: 'Goal Rejected',
    message: `Your goal "${goalToReject.title}" has been rejected. Please check the feedback.`,
    type: 'error',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
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

export const returnGoalForRevision = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReturn = goals.find(g => g.id === goalId);
  
  if (!goalToReturn) return;
  
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
  
  createNotification({
    userId: goalToReturn.userId,
    title: 'Goal Needs Revision',
    message: `Your goal "${goalToReturn.title}" requires revision. Please check the feedback.`,
    type: 'warning',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
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

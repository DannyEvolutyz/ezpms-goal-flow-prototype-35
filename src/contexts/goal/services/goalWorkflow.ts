
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
  canCreateOrEditGoals?: (spaceId?: string) => boolean;
}

export const submitGoal = ({
  goals,
  goalId,
  user,
  setGoals,
  setNotifications,
  createNotification,
  getAllUsers,
  canCreateOrEditGoals
}: SubmitGoalParams) => {
  if (!user) return;
  
  const goalToSubmit = goals.find(g => g.id === goalId);
  
  if (!goalToSubmit || goalToSubmit.userId !== user.id) return;
  
  // Check if user can submit goals in this space
  if (canCreateOrEditGoals && !canCreateOrEditGoals(goalToSubmit.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Submission Failed',
      message: 'You cannot submit goals in this space right now due to submission deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
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
  canReviewGoals?: (spaceId?: string) => boolean;
}

export const approveGoal = ({
  goals,
  goalId,
  feedback,
  user,
  setGoals,
  setNotifications,
  createNotification,
  canReviewGoals
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToApprove = goals.find(g => g.id === goalId);
  
  if (!goalToApprove) return;
  
  // Check if manager can review goals in this space
  if (canReviewGoals && !canReviewGoals(goalToApprove.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Review Failed',
      message: 'You cannot review goals in this space right now due to review deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
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
  createNotification,
  canReviewGoals
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReject = goals.find(g => g.id === goalId);
  
  if (!goalToReject) return;
  
  // Check if manager can review goals in this space
  if (canReviewGoals && !canReviewGoals(goalToReject.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Review Failed',
      message: 'You cannot review goals in this space right now due to review deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
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
  createNotification,
  canReviewGoals
}: ApproveGoalParams) => {
  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return;
  
  const goalToReturn = goals.find(g => g.id === goalId);
  
  if (!goalToReturn) return;
  
  // Check if manager can review goals in this space
  if (canReviewGoals && !canReviewGoals(goalToReturn.spaceId)) {
    createNotification({
      userId: user.id,
      title: 'Goal Review Failed',
      message: 'You cannot review goals in this space right now due to review deadline.',
      type: 'error',
      setNotifications,
    });
    return;
  }
  
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

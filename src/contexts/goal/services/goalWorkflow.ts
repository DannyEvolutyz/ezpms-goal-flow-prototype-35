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
  console.log('🎯 submitGoal called for goalId:', goalId, 'by user:', user?.id);
  
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
  
  console.log('📤 Creating user notification for goal submission');
  // Notification for the user who submitted
  createNotification({
    userId: user.id,
    title: 'Goal Submitted Successfully',
    message: `You've submitted your goal: ${goalToSubmit.title}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  // Find manager and notify them
  const allUsers = getAllUsers();
  const manager = allUsers.find(u => u.id === user.managerId);
  
  if (manager) {
    console.log('👔 Creating manager notification for goal submission');
    createNotification({
      userId: manager.id,
      title: 'New Goal Submitted for Review',
      message: `${user.name} has submitted a goal for your review: ${goalToSubmit.title}`,
      type: 'info',
      targetType: 'goal',
      targetId: goalId,
      setNotifications
    });
  }
  
  // Notify all admins
  const admins = allUsers.filter(u => u.role === 'admin');
  console.log('👑 Creating admin notifications for goal submission, admin count:', admins.length);
  admins.forEach(admin => {
    createNotification({
      userId: admin.id,
      title: 'Goal Submitted',
      message: `${user.name} submitted a goal: ${goalToSubmit.title}`,
      type: 'info',
      targetType: 'goal',
      targetId: goalId,
      setNotifications
    });
  });
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
  console.log('✅ approveGoal called for goalId:', goalId, 'by user:', user?.id);
  
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
  
  console.log('📤 Creating goal owner notification for approval');
  // Notification for the goal owner
  createNotification({
    userId: goalToApprove.userId,
    title: 'Goal Approved! 🎉',
    message: `Your goal "${goalToApprove.title}" has been approved${feedback ? '. See feedback for details.' : '.'}`,
    type: 'success',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  console.log('📤 Creating reviewer notification for approval');
  // Notification for the reviewer
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
  console.log('❌ rejectGoal called for goalId:', goalId, 'by user:', user?.id);
  
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
  
  console.log('📤 Creating goal owner notification for rejection');
  // Notification for the goal owner
  createNotification({
    userId: goalToReject.userId,
    title: 'Goal Rejected',
    message: `Your goal "${goalToReject.title}" has been rejected. Please check the feedback and make necessary changes.`,
    type: 'error',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  console.log('📤 Creating reviewer notification for rejection');
  // Notification for the reviewer
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
  console.log('🔄 returnGoalForRevision called for goalId:', goalId, 'by user:', user?.id);
  
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
  
  console.log('📤 Creating goal owner notification for revision request');
  // Notification for the goal owner
  createNotification({
    userId: goalToReturn.userId,
    title: 'Goal Needs Revision',
    message: `Your goal "${goalToReturn.title}" requires revision. Please check the feedback and make necessary changes.`,
    type: 'warning',
    targetType: 'goal',
    targetId: goalId,
    setNotifications
  });
  
  console.log('📤 Creating reviewer notification for revision request');
  // Notification for the reviewer
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

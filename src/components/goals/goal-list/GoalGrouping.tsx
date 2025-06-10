
import { Goal } from '@/types';

export const useGoalGrouping = (goals: Goal[]) => {
  // Group goals by status
  const draftGoals = goals.filter(g => g.status === 'draft');
  const pendingApprovalGoals = goals.filter(g => g.status === 'pending_approval');
  const approvedGoals = goals.filter(g => g.status === 'approved');
  const rejectedGoals = goals.filter(g => g.status === 'rejected');
  const submittedGoals = goals.filter(g => g.status === 'submitted');
  const underReviewGoals = goals.filter(g => g.status === 'under_review');
  const finalApprovedGoals = goals.filter(g => g.status === 'final_approved');

  const goalsByStatus = [
    { title: 'Draft', goals: draftGoals, showApprovalOption: true },
    { title: 'Under Review', goals: underReviewGoals, showApprovalOption: true },
    { title: 'Pending Approval', goals: pendingApprovalGoals },
    { title: 'Approved', goals: approvedGoals, showSubmitOption: true },
    { title: 'Rejected', goals: rejectedGoals, showApprovalOption: true },
    { title: 'Submitted for Review', goals: submittedGoals },
    { title: 'Final Approved', goals: finalApprovedGoals },
  ];

  const hasGoals = goalsByStatus.some(group => group.goals.length > 0);
  const totalWeightage = goals.reduce((sum, goal) => sum + goal.weightage, 0);

  return {
    goalsByStatus,
    hasGoals,
    totalWeightage,
    draftGoals
  };
};

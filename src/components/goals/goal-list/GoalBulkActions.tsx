
import { Goal } from '@/types';
import { toast } from '@/hooks/use-toast';

interface GoalBulkActionsProps {
  goals: Goal[];
  effectiveReadOnly: boolean;
  onUpdateGoal: (updatedGoal: Goal) => void;
  clearSelection: () => void;
}

const useGoalBulkActions = ({ goals, effectiveReadOnly, onUpdateGoal, clearSelection }: GoalBulkActionsProps) => {
  const handleBulkSendForApproval = (goalIds: string[]) => {
    console.log('📊 handleBulkSendForApproval called for goalIds:', goalIds);
    
    if (effectiveReadOnly) {
      toast({
        title: "Cannot send for approval",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }

    goalIds.forEach(goalId => {
      console.log('🔄 Processing goalId for approval:', goalId);
      const goal = goals.find(g => g.id === goalId);
      if (goal && goal.status === 'draft') {
        onUpdateGoal({
          ...goal,
          status: 'pending_approval',
          updatedAt: new Date().toISOString()
        });
      }
    });

    toast({
      title: "Goals sent for approval",
      description: `${goalIds.length} goal${goalIds.length > 1 ? 's' : ''} have been sent to your manager for approval.`,
      variant: "default"
    });

    clearSelection();
  };

  const handleBulkSubmitForReview = (goalIds: string[]) => {
    console.log('📋 handleBulkSubmitForReview called for goalIds:', goalIds);
    
    if (effectiveReadOnly) {
      toast({
        title: "Cannot submit goals",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }

    // Check if total weightage of all approved goals is 100%
    const allApprovedGoals = goals.filter(g => g.status === 'approved');
    const totalApprovedWeightage = allApprovedGoals.reduce((sum, goal) => sum + goal.weightage, 0);
    
    console.log('⚖️ Total approved goals weightage:', totalApprovedWeightage);
    
    if (totalApprovedWeightage !== 100) {
      toast({
        title: "Cannot submit goals",
        description: `Total weightage of approved goals must be 100%. Current total: ${totalApprovedWeightage}%`,
        variant: "destructive"
      });
      return;
    }

    goalIds.forEach(goalId => {
      console.log('🔄 Processing goalId for review submission:', goalId);
      const goal = goals.find(g => g.id === goalId);
      if (goal && goal.status === 'approved') {
        onUpdateGoal({
          ...goal,
          status: 'submitted',
          updatedAt: new Date().toISOString()
        });
      }
    });

    toast({
      title: "Goals submitted for review",
      description: `${goalIds.length} goal${goalIds.length > 1 ? 's' : ''} have been submitted for final review.`,
      variant: "default"
    });

    clearSelection();
  };

  return {
    handleBulkSendForApproval,
    handleBulkSubmitForReview
  };
};

export default useGoalBulkActions;

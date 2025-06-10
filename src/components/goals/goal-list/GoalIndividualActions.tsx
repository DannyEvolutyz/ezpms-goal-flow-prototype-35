
import { Goal } from '@/types';
import { toast } from '@/hooks/use-toast';

interface GoalIndividualActionsProps {
  goals: Goal[];
  effectiveReadOnly: boolean;
  onUpdateGoal: (updatedGoal: Goal) => void;
  onEditGoal?: (goalId: string) => void;
}

const useGoalIndividualActions = ({ goals, effectiveReadOnly, onUpdateGoal, onEditGoal }: GoalIndividualActionsProps) => {
  const handleSendForApproval = (goalId: string) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot send for approval",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdateGoal({
        ...goal,
        status: 'pending_approval',
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Goal sent for approval",
        description: "Your goal has been sent to your manager for approval.",
        variant: "default"
      });
    }
  };

  const handleSubmitGoal = (goalId: string) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot submit goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdateGoal({
        ...goal,
        status: 'submitted',
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Goal submitted for review",
        description: "Your goal has been submitted for final review.",
        variant: "default"
      });
    }
  };
  
  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    
    console.log('handleEditGoal called in GoalIndividualActions for goalId:', goalId);
    console.log('Goal found:', goal);
    console.log('effectiveReadOnly:', effectiveReadOnly);
    console.log('onEditGoal function:', onEditGoal);
    
    if (effectiveReadOnly && goal?.status !== 'under_review') {
      toast({
        title: "Cannot edit goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    if (onEditGoal) {
      onEditGoal(goalId);
    } else {
      console.error('onEditGoal function not provided to GoalIndividualActions');
      toast({
        title: "Cannot edit goal",
        description: "Edit functionality is not available.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateWeightage = (goalId: string, weightage: number) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot update weightage",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    const goal = goals.find(g => g.id === goalId);
    // Allow weightage updates for draft, rejected, under_review, and approved goals
    if (goal && (goal.status === 'draft' || goal.status === 'rejected' || goal.status === 'under_review' || goal.status === 'approved')) {
      onUpdateGoal({
        ...goal,
        weightage,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return {
    handleSendForApproval,
    handleSubmitGoal,
    handleEditGoal,
    handleUpdateWeightage
  };
};

export default useGoalIndividualActions;

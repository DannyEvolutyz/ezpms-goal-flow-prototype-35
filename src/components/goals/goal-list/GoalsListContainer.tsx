
import React from 'react';
import { Goal } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ReadOnlyWarning from './ReadOnlyWarning';
import NoGoalsMessage from './NoGoalsMessage';
import GoalStatusGroup from './GoalStatusGroup';
import CreateGoalButton from './CreateGoalButton';
import GoalsSummaryCard from './GoalsSummaryCard';

interface GoalsListContainerProps {
  goals: Goal[];
  effectiveReadOnly: boolean;
  onCreateNew: () => void;
  onUpdateGoal: (updatedGoal: Goal) => void;
}

const GoalsListContainer: React.FC<GoalsListContainerProps> = ({
  goals,
  effectiveReadOnly,
  onCreateNew,
  onUpdateGoal
}) => {
  const navigate = useNavigate();

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
    
    if (effectiveReadOnly && goal?.status !== 'under_review') {
      toast({
        title: "Cannot edit goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/goals/edit/${goalId}`);
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
    if (goal && (goal.status === 'draft' || goal.status === 'rejected' || goal.status === 'under_review')) {
      onUpdateGoal({
        ...goal,
        weightage,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Display read-only warning if applicable */}
      {effectiveReadOnly && <ReadOnlyWarning />}
      
      {/* Weightage Summary */}
      {hasGoals && <GoalsSummaryCard totalWeightage={totalWeightage} />}
      
      {/* Show message when no goals exist */}
      {!hasGoals && (
        <NoGoalsMessage 
          onCreateNew={onCreateNew}
          isManager={false}
          effectiveReadOnly={effectiveReadOnly}
        />
      )}

      {/* Render goal groups by status */}
      {goalsByStatus.map(group => (
        <GoalStatusGroup
          key={group.title}
          title={group.title}
          goals={group.goals}
          effectiveReadOnly={effectiveReadOnly}
          onEditGoal={handleEditGoal}
          onSubmitGoal={handleSubmitGoal}
          onSendForApproval={handleSendForApproval}
          onUpdateWeightage={handleUpdateWeightage}
          showSubmitOption={group.showSubmitOption}
          showApprovalOption={group.showApprovalOption}
        />
      ))}

      {/* Create goal button for existing goals */}
      {hasGoals && !effectiveReadOnly && draftGoals.length < 5 && (
        <CreateGoalButton onCreateNew={onCreateNew} />
      )}
      
      {/* Read-only message */}
      {hasGoals && effectiveReadOnly && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          The submission period for this goal space has ended. Goals are now read-only.
        </div>
      )}
    </div>
  );
};

export default GoalsListContainer;

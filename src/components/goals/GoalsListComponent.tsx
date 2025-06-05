
import React from 'react';
import { useGoals } from '@/contexts/GoalContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Goal } from '@/types';
import ReadOnlyWarning from './goal-list/ReadOnlyWarning';
import NoGoalsMessage from './goal-list/NoGoalsMessage';
import GoalStatusGroup from './goal-list/GoalStatusGroup';
import CreateGoalButton from './goal-list/CreateGoalButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoalsListComponentProps {
  onCreateNew?: () => void;
  goals?: Goal[];
  spaceId?: string;
  isReadOnly?: boolean;
}

const GoalsListComponent: React.FC<GoalsListComponentProps> = ({ 
  onCreateNew, 
  goals: propGoals,
  spaceId,
  isReadOnly = false
}) => {
  const { getGoalsByStatus, updateGoal, submitGoal, isSpaceReadOnly } = useGoals();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === 'manager';

  // Determine if the space is read-only
  const isSpaceReadOnlyState = spaceId ? isSpaceReadOnly(spaceId) : false;
  const effectiveReadOnly = isReadOnly || isSpaceReadOnlyState;

  // Use provided goals or fetch by status
  const goals = propGoals || [
    ...getGoalsByStatus('draft'),
    ...getGoalsByStatus('pending_approval'),
    ...getGoalsByStatus('approved'),
    ...getGoalsByStatus('rejected'),
    ...getGoalsByStatus('submitted'),
    ...getGoalsByStatus('under_review'),
    ...getGoalsByStatus('final_approved')
  ];

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
    { title: 'Pending Approval', goals: pendingApprovalGoals },
    { title: 'Approved', goals: approvedGoals, showSubmitOption: true },
    { title: 'Rejected', goals: rejectedGoals },
    { title: 'Submitted for Review', goals: submittedGoals },
    { title: 'Under Review', goals: underReviewGoals },
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
      updateGoal({
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
      updateGoal({
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
    if (effectiveReadOnly) {
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
    if (goal && goal.status === 'draft') {
      updateGoal({
        ...goal,
        weightage,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleCreateNew = () => {
    console.log('Create new goal clicked in GoalsListComponent');
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <div className="space-y-6">
      {/* Display read-only warning if applicable */}
      {effectiveReadOnly && <ReadOnlyWarning />}
      
      {/* Weightage Summary */}
      {hasGoals && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goals Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Weightage:</span>
              <span className={`font-bold text-lg ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeightage}%
              </span>
            </div>
            {totalWeightage !== 100 && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ Total weightage should equal 100% before sending goals for approval
              </p>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Show message when no goals exist */}
      {!hasGoals && (
        <NoGoalsMessage 
          onCreateNew={handleCreateNew}
          isManager={isManager}
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
      {hasGoals && !isManager && !effectiveReadOnly && draftGoals.length < 5 && (
        <CreateGoalButton onCreateNew={handleCreateNew} />
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

export default GoalsListComponent;

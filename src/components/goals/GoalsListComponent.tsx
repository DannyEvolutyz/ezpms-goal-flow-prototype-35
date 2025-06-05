
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

  // Use provided goals or fetch by status, excluding draft goals
  const goals = propGoals || [
    ...getGoalsByStatus('submitted'),
    ...getGoalsByStatus('approved'),
    ...getGoalsByStatus('rejected'),
    ...getGoalsByStatus('under_review')
  ];

  // Group goals by status, excluding draft goals
  const submittedGoals = goals.filter(g => g.status === 'submitted');
  const approvedGoals = goals.filter(g => g.status === 'approved');
  const rejectedGoals = goals.filter(g => g.status === 'rejected');
  const underReviewGoals = goals.filter(g => g.status === 'under_review');

  const goalsByStatus = [
    { title: 'Submitted', goals: submittedGoals },
    { title: 'Approved', goals: approvedGoals, showSubmitOption: true },
    { title: 'Rejected', goals: rejectedGoals },
    { title: 'Under Review', goals: underReviewGoals },
  ];

  const hasGoals = goalsByStatus.some(group => group.goals.length > 0);

  const handleMarkGoalComplete = (goal: Goal) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot update goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedGoal = {
      ...goal,
      milestones: goal.milestones?.map(m => ({ ...m, completed: true })) || [],
    };
    updateGoal(updatedGoal);
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
    
    submitGoal(goalId);
    toast({
      title: "Goal submitted",
      description: "Your goal has been submitted to your manager for review.",
      variant: "default"
    });
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
    
    // Navigate to edit goal page or trigger edit mode
    navigate(`/goals/edit/${goalId}`);
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
          showSubmitOption={group.showSubmitOption}
        />
      ))}

      {/* Create goal button for existing goals */}
      {hasGoals && !isManager && !effectiveReadOnly && (
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

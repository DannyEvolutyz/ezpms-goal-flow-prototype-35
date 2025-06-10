import React from 'react';
import { Goal } from '@/types';
import GoalCard from './GoalCard';
import BulkGoalActions from './BulkGoalActions';

interface GoalStatusGroupProps {
  title: string;
  goals: Goal[];
  effectiveReadOnly: boolean;
  onEditGoal: (goalId: string) => void;
  onSubmitGoal: (goalId: string) => void;
  onSendForApproval: (goalId: string) => void;
  onUpdateWeightage: (goalId: string, weightage: number) => void;
  showSubmitOption?: boolean;
  showApprovalOption?: boolean;
  selectedGoalIds?: string[];
  onToggleSelectGoal?: (goalId: string, selected: boolean) => void;
  onSelectAllGoals?: (goalIds: string[], selected: boolean) => void;
  onBulkSendForApproval?: (goalIds: string[]) => void;
  onBulkSubmitForReview?: (goalIds: string[]) => void;
  allGoals?: Goal[];
}

const GoalStatusGroup: React.FC<GoalStatusGroupProps> = ({
  title,
  goals,
  effectiveReadOnly,
  onEditGoal,
  onSubmitGoal,
  onSendForApproval,
  onUpdateWeightage,
  showSubmitOption = false,
  showApprovalOption = false,
  selectedGoalIds = [],
  onToggleSelectGoal,
  onSelectAllGoals,
  onBulkSendForApproval,
  onBulkSubmitForReview,
  allGoals = []
}) => {
  if (goals.length === 0) {
    return null;
  }

  // Goals that can be sent for approval (draft status)
  const selectableGoalsForApproval = goals.filter(goal => !effectiveReadOnly && goal.status === 'draft');
  const selectableApprovalGoalIds = selectableGoalsForApproval.map(goal => goal.id);
  const selectedSelectableApprovalGoals = selectedGoalIds.filter(id => selectableApprovalGoalIds.includes(id));

  // Goals that can be submitted for review (approved status)
  const selectableGoalsForSubmit = goals.filter(goal => !effectiveReadOnly && goal.status === 'approved');
  const selectableSubmitGoalIds = selectableGoalsForSubmit.map(goal => goal.id);
  const selectedSelectableSubmitGoals = selectedGoalIds.filter(id => selectableSubmitGoalIds.includes(id));

  // Calculate total weightage of all approved goals for submission validation
  const allApprovedGoals = allGoals.filter(goal => goal.status === 'approved');
  const totalApprovedWeightage = allApprovedGoals.reduce((sum, goal) => sum + goal.weightage, 0);

  const handleSelectAllApproval = (checked: boolean) => {
    if (onSelectAllGoals) {
      onSelectAllGoals(selectableApprovalGoalIds, checked);
    }
  };

  const handleSelectAllSubmit = (checked: boolean) => {
    if (onSelectAllGoals) {
      onSelectAllGoals(selectableSubmitGoalIds, checked);
    }
  };

  const handleBulkSendForApproval = () => {
    if (onBulkSendForApproval) {
      onBulkSendForApproval(selectedSelectableApprovalGoals);
    }
  };

  const handleBulkSubmitForReview = () => {
    if (onBulkSubmitForReview) {
      onBulkSubmitForReview(selectedSelectableSubmitGoals);
    }
  };

  const showApprovalBulkActions = showApprovalOption && selectableGoalsForApproval.length > 0;
  const showSubmitBulkActions = showSubmitOption && selectableGoalsForSubmit.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} ({goals.length})</h3>
      
      {showApprovalBulkActions && (
        <BulkGoalActions
          selectedGoalIds={selectedSelectableApprovalGoals}
          totalSelectableGoals={selectableGoalsForApproval.length}
          onSelectAll={handleSelectAllApproval}
          onSendSelectedForApproval={handleBulkSendForApproval}
          effectiveReadOnly={effectiveReadOnly}
        />
      )}

      {showSubmitBulkActions && (
        <BulkGoalActions
          selectedGoalIds={selectedSelectableSubmitGoals}
          totalSelectableGoals={selectableGoalsForSubmit.length}
          onSelectAll={handleSelectAllSubmit}
          onSendSelectedForApproval={handleBulkSubmitForReview}
          effectiveReadOnly={effectiveReadOnly}
          actionLabel="Submit Selected for Review"
          selectLabel="goals"
          totalWeightage={totalApprovedWeightage}
          isSubmissionAction={true}
        />
      )}
      
      <div className="space-y-4">
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            effectiveReadOnly={effectiveReadOnly}
            onEditGoal={onEditGoal}
            onSubmitGoal={onSubmitGoal}
            onSendForApproval={onSendForApproval}
            onUpdateWeightage={onUpdateWeightage}
            showSubmitOption={false}
            showApprovalOption={showApprovalOption}
            showCheckbox={(showApprovalBulkActions && goal.status === 'draft') || (showSubmitBulkActions && goal.status === 'approved')}
            isSelected={selectedGoalIds.includes(goal.id)}
            onToggleSelect={onToggleSelectGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalStatusGroup;

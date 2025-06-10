
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
  onBulkSendForApproval
}) => {
  if (goals.length === 0) {
    return null;
  }

  // Goals that can be sent for approval (draft status)
  const selectableGoals = goals.filter(goal => !effectiveReadOnly && goal.status === 'draft');
  const selectableGoalIds = selectableGoals.map(goal => goal.id);
  const selectedSelectableGoals = selectedGoalIds.filter(id => selectableGoalIds.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAllGoals) {
      onSelectAllGoals(selectableGoalIds, checked);
    }
  };

  const handleBulkSendForApproval = () => {
    if (onBulkSendForApproval) {
      onBulkSendForApproval(selectedSelectableGoals);
    }
  };

  const showBulkActions = showApprovalOption && selectableGoals.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} ({goals.length})</h3>
      
      {showBulkActions && (
        <BulkGoalActions
          selectedGoalIds={selectedSelectableGoals}
          totalSelectableGoals={selectableGoals.length}
          onSelectAll={handleSelectAll}
          onSendSelectedForApproval={handleBulkSendForApproval}
          effectiveReadOnly={effectiveReadOnly}
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
            showSubmitOption={showSubmitOption}
            showApprovalOption={showApprovalOption}
            showCheckbox={showBulkActions && goal.status === 'draft'}
            isSelected={selectedGoalIds.includes(goal.id)}
            onToggleSelect={onToggleSelectGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalStatusGroup;

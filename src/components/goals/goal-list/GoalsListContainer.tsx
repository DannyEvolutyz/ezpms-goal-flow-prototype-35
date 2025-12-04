
import React from 'react';
import { Goal } from '@/types';
import ReadOnlyWarning from './ReadOnlyWarning';
import NoGoalsMessage from './NoGoalsMessage';
import GoalStatusGroup from './GoalStatusGroup';
import CreateGoalButton from './CreateGoalButton';
import GoalsSummaryCard from './GoalsSummaryCard';
import GoalSelectionManager from './GoalSelectionManager';
import useGoalBulkActions from './GoalBulkActions';
import useGoalIndividualActions from './GoalIndividualActions';
import { useGoalGrouping } from './GoalGrouping';

interface GoalsListContainerProps {
  goals: Goal[];
  effectiveReadOnly: boolean;
  onCreateNew: () => void;
  onEditGoal?: (goalId: string) => void;
  onUpdateGoal: (updatedGoal: Goal) => void;
}

const GoalsListContainer: React.FC<GoalsListContainerProps> = ({
  goals,
  effectiveReadOnly,
  onCreateNew,
  onEditGoal,
  onUpdateGoal
}) => {
  const { goalsByStatus, hasGoals, totalWeightage, draftGoals } = useGoalGrouping(goals);

  return (
    <GoalSelectionManager>
      {({ selectedGoalIds, handleToggleSelectGoal, handleSelectAllGoals, clearSelection }) => {
        const bulkActions = useGoalBulkActions({
          goals,
          effectiveReadOnly,
          onUpdateGoal,
          clearSelection
        });

        const individualActions = useGoalIndividualActions({
          goals,
          effectiveReadOnly,
          onUpdateGoal,
          onEditGoal
        });

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
                onEditGoal={individualActions.handleEditGoal}
                onSubmitGoal={individualActions.handleSubmitGoal}
                onSendForApproval={individualActions.handleSendForApproval}
                onUpdateWeightage={individualActions.handleUpdateWeightage}
                showSubmitOption={group.showSubmitOption}
                showApprovalOption={group.showApprovalOption}
                selectedGoalIds={selectedGoalIds}
                onToggleSelectGoal={handleToggleSelectGoal}
                onSelectAllGoals={handleSelectAllGoals}
                onBulkSendForApproval={bulkActions.handleBulkSendForApproval}
                onBulkSubmitForReview={bulkActions.handleBulkSubmitForReview}
                allGoals={goals}
                totalWeightage={totalWeightage}
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
      }}
    </GoalSelectionManager>
  );
};

export default GoalsListContainer;

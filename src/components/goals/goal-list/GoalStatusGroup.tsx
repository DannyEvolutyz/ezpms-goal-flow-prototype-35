
import React from 'react';
import { Goal } from '@/types';
import GoalCard from './GoalCard';

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
  showApprovalOption = false
}) => {
  if (goals.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        {title}
        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {goals.length}
        </span>
      </h3>
      
      <div className="grid gap-4">
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
          />
        ))}
      </div>
    </div>
  );
};

export default GoalStatusGroup;


import React from 'react';
import { Goal } from '@/types';
import GoalCard from './GoalCard';

interface GoalStatusGroupProps {
  title: string;
  goals: Goal[];
  effectiveReadOnly: boolean;
  onEditGoal: (goalId: string) => void;
  onSubmitGoal: (goalId: string) => void;
  showSubmitOption?: boolean;
}

const GoalStatusGroup: React.FC<GoalStatusGroupProps> = ({
  title,
  goals,
  effectiveReadOnly,
  onEditGoal,
  onSubmitGoal,
  showSubmitOption = false
}) => {
  if (goals.length === 0) {
    return null;
  }

  // Don't render draft goals section
  if (title === 'Draft') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{title} Goals</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            effectiveReadOnly={effectiveReadOnly}
            onEditGoal={onEditGoal}
            onSubmitGoal={onSubmitGoal}
            showSubmitOption={showSubmitOption}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalStatusGroup;

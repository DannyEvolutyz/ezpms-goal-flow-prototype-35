
import React from 'react';
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types';
import GoalsListContainer from './goal-list/GoalsListContainer';

interface GoalsListComponentProps {
  onCreateNew?: () => void;
  onEditGoal?: (goalId: string) => void;
  goals?: Goal[];
  spaceId?: string;
  isReadOnly?: boolean;
}

const GoalsListComponent: React.FC<GoalsListComponentProps> = ({ 
  onCreateNew, 
  onEditGoal,
  goals: propGoals,
  spaceId,
  isReadOnly = false
}) => {
  const { getGoalsByStatus, updateGoal, isSpaceReadOnly } = useGoals();
  const { user } = useAuth();

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

  const handleCreateNew = () => {
    console.log('Create new goal clicked in GoalsListComponent');
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <GoalsListContainer
      goals={goals}
      effectiveReadOnly={effectiveReadOnly}
      onCreateNew={handleCreateNew}
      onEditGoal={onEditGoal}
      onUpdateGoal={updateGoal}
    />
  );
};

export default GoalsListComponent;


import { useState } from 'react';

interface GoalSelectionManagerProps {
  children: (selectionState: {
    selectedGoalIds: string[];
    handleToggleSelectGoal: (goalId: string, selected: boolean) => void;
    handleSelectAllGoals: (goalIds: string[], selected: boolean) => void;
    clearSelection: () => void;
  }) => React.ReactNode;
}

const GoalSelectionManager: React.FC<GoalSelectionManagerProps> = ({ children }) => {
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  const handleToggleSelectGoal = (goalId: string, selected: boolean) => {
    setSelectedGoalIds(prev => 
      selected 
        ? [...prev, goalId]
        : prev.filter(id => id !== goalId)
    );
  };

  const handleSelectAllGoals = (goalIds: string[], selected: boolean) => {
    setSelectedGoalIds(prev => {
      if (selected) {
        // Add all goalIds that aren't already selected
        const newIds = goalIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        // Remove all goalIds from selection
        return prev.filter(id => !goalIds.includes(id));
      }
    });
  };

  const clearSelection = () => {
    setSelectedGoalIds([]);
  };

  return (
    <>
      {children({
        selectedGoalIds,
        handleToggleSelectGoal,
        handleSelectAllGoals,
        clearSelection
      })}
    </>
  );
};

export default GoalSelectionManager;

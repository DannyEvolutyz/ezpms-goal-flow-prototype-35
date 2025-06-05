
import React from 'react';
import { Input } from '@/components/ui/input';

interface GoalWeightageProps {
  weightage: number;
  isLocked: boolean;
  effectiveReadOnly: boolean;
  onUpdateWeightage: (weightage: number) => void;
}

const GoalWeightage: React.FC<GoalWeightageProps> = ({ 
  weightage, 
  isLocked, 
  effectiveReadOnly, 
  onUpdateWeightage 
}) => {
  const handleWeightageChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      onUpdateWeightage(numValue);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2 p-2 bg-blue-50 rounded-md">
      <span className="text-sm font-medium text-blue-800">Goal Weightage:</span>
      <Input
        type="number"
        min="0"
        max="100"
        value={weightage}
        onChange={(e) => handleWeightageChange(e.target.value)}
        disabled={isLocked || effectiveReadOnly}
        className="w-20 h-8"
      />
      <span className="text-sm text-blue-800">%</span>
    </div>
  );
};

export default GoalWeightage;

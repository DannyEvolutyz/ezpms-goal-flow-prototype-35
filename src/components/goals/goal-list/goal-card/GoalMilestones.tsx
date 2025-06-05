
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check as CheckIcon } from 'lucide-react';
import { Milestone } from '@/types';

interface GoalMilestonesProps {
  milestones?: Milestone[];
}

const GoalMilestones: React.FC<GoalMilestonesProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  const getCompletion = () => {
    const completed = milestones.filter(m => m.completed).length;
    return Math.round(100 * (completed / milestones.length));
  };

  const percent = getCompletion();

  return (
    <div className="my-2">
      <Progress value={percent} className="h-2" />
      <div className="text-xs text-gray-500 mt-1">Goal Completion: {percent}%</div>
      <ul className="mt-2 space-y-1 pl-2">
        {milestones.map(milestone => (
          <li key={milestone.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={milestone.completed ? "text-green-600" : ""}>
                {milestone.completed ? <CheckIcon className="inline-block h-4 w-4" /> : <span className="w-4 inline-block" />}
              </span>
              <span>{milestone.title}</span>
            </div>
            {milestone.completionComment && (
              <span className="ml-6 text-xs text-gray-500">
                Comment: {milestone.completionComment}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalMilestones;

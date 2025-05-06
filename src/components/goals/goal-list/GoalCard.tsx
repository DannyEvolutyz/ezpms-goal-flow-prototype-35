
import React from 'react';
import { Goal } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Check as CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  effectiveReadOnly: boolean;
  onEditGoal: (goalId: string) => void;
  onSubmitGoal: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  effectiveReadOnly, 
  onEditGoal, 
  onSubmitGoal 
}) => {
  const getCompletion = (goal: Goal) => {
    if (!goal.milestones || !goal.milestones.length) return 0;
    const completed = goal.milestones.filter(m => m.completed).length;
    return Math.round(100 * (completed / goal.milestones.length));
  };

  const percent = getCompletion(goal);
  const allComplete = percent === 100 && goal.milestones?.length > 0;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{goal.title}</h4>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Weightage: {goal.weightage}%
          </span>
          {effectiveReadOnly && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This goal is now read-only</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">{goal.description}</div>

      {goal.milestones && goal.milestones.length > 0 && (
        <div className="my-2">
          <Progress value={percent} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">Goal Completion: {percent}%</div>
          <ul className="mt-2 space-y-1 pl-2">
            {goal.milestones.map(milestone => (
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
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {goal.category}
        </span>
        <span className="text-xs text-gray-500">
          Due: {new Date(goal.targetDate).toLocaleDateString()}
        </span>
      </div>
      
      {/* Goal Action Buttons */}
      {goal.status === 'draft' && !effectiveReadOnly && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEditGoal(goal.id)}
            className="text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => onSubmitGoal(goal.id)}
            className="text-xs"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalCard;

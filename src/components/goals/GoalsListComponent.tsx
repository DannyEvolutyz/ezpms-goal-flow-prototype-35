
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Lock, Edit, AlertCircle } from 'lucide-react';
import { useGoals } from '@/contexts/GoalContext';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Check as CheckIcon } from 'lucide-react';
import { Goal } from '@/types';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface GoalsListComponentProps {
  onCreateNew?: () => void;
  goals?: Goal[];
  spaceId?: string;
  isReadOnly?: boolean;
}

const GoalsListComponent: React.FC<GoalsListComponentProps> = ({ 
  onCreateNew, 
  goals: propGoals,
  spaceId,
  isReadOnly = false
}) => {
  const { getGoalsByStatus, updateGoal, submitGoal, isSpaceReadOnly } = useGoals();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === 'manager';

  // Determine if the space is read-only
  const isSpaceReadOnlyState = spaceId ? isSpaceReadOnly(spaceId) : false;
  const effectiveReadOnly = isReadOnly || isSpaceReadOnlyState;

  // Use provided goals or fetch by status
  const goals = propGoals || [
    ...getGoalsByStatus('draft'),
    ...getGoalsByStatus('submitted'),
    ...getGoalsByStatus('approved'),
    ...getGoalsByStatus('rejected'),
    ...getGoalsByStatus('under_review')
  ];

  // Group goals by status
  const draftGoals = goals.filter(g => g.status === 'draft');
  const submittedGoals = goals.filter(g => g.status === 'submitted');
  const approvedGoals = goals.filter(g => g.status === 'approved');
  const rejectedGoals = goals.filter(g => g.status === 'rejected');
  const underReviewGoals = goals.filter(g => g.status === 'under_review');

  const goalsByStatus = [
    { status: 'Draft', goals: draftGoals, variant: 'outline' },
    { status: 'Submitted', goals: submittedGoals, variant: 'secondary' },
    { status: 'Approved', goals: approvedGoals, variant: 'success' },
    { status: 'Rejected', goals: rejectedGoals, variant: 'destructive' },
    { status: 'Under Review', goals: underReviewGoals, variant: 'warning' },
  ];

  const hasGoals = goalsByStatus.some(group => group.goals.length > 0);

  const getCompletion = (goal: Goal) => {
    if (!goal.milestones || !goal.milestones.length) return 0;
    const completed = goal.milestones.filter(m => m.completed).length;
    return Math.round(100 * (completed / goal.milestones.length));
  };

  const handleMarkGoalComplete = (goal: Goal) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot update goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedGoal = {
      ...goal,
      milestones: goal.milestones?.map(m => ({ ...m, completed: true })) || [],
    };
    updateGoal(updatedGoal);
  };
  
  const handleSubmitGoal = (goalId: string) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot submit goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    submitGoal(goalId);
  };
  
  const handleEditGoal = (goalId: string) => {
    if (effectiveReadOnly) {
      toast({
        title: "Cannot edit goal",
        description: "This goal space is now read-only.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to edit goal page or trigger edit mode
    navigate(`/goals/edit/${goalId}`);
  };

  return (
    <div className="space-y-6">
      {effectiveReadOnly && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-800 text-sm">
            This goal space is now read-only. You can view goals but cannot create, edit, or submit them.
          </p>
        </div>
      )}
      
      {!hasGoals && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any goals in this space yet.</p>
          {!isManager && !effectiveReadOnly && (
            <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create my first goal</span>
            </Button>
          )}
          {effectiveReadOnly && (
            <p className="text-sm text-muted-foreground">
              You can no longer create goals in this space as the submission deadline has passed.
            </p>
          )}
        </div>
      )}

      {goalsByStatus.map(group => (
        group.goals.length > 0 && (
          <div key={group.status} className="space-y-4">
            <h3 className="font-medium text-lg">{group.status} Goals</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {group.goals.map(goal => {
                const percent = getCompletion(goal);
                const allComplete = percent === 100 && goal.milestones?.length > 0;
                
                return (
                  <div key={goal.id} className="border rounded-lg p-4">
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
                          onClick={() => handleEditGoal(goal.id)}
                          className="text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitGoal(goal.id)}
                          className="text-xs"
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      {hasGoals && !isManager && !effectiveReadOnly && (
        <div className="mt-6 text-center">
          <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Goal</span>
          </Button>
        </div>
      )}
      
      {hasGoals && effectiveReadOnly && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          The submission period for this goal space has ended. Goals are now read-only.
        </div>
      )}
    </div>
  );
};

export default GoalsListComponent;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGoals } from '@/contexts/GoalContext';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Check as CheckIcon } from 'lucide-react';
import { Goal, Milestone } from '@/types/goal';

interface GoalsListComponentProps {
  onCreateNew?: () => void;
}

const GoalsListComponent: React.FC<GoalsListComponentProps> = ({ onCreateNew }) => {
  const { getGoalsByStatus, updateGoal } = useGoals();
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  const draftGoals = getGoalsByStatus('draft');
  const submittedGoals = getGoalsByStatus('submitted');
  const approvedGoals = getGoalsByStatus('approved');
  const rejectedGoals = getGoalsByStatus('rejected');
  const underReviewGoals = getGoalsByStatus('under_review');

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
    const updatedGoal = {
      ...goal,
      milestones: goal.milestones?.map(m => ({ ...m, completed: true })) || [],
    };
    updateGoal(updatedGoal);
  };

  return (
    <div className="space-y-6">
      {!hasGoals && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any goals yet.</p>
          {!isManager && (
            <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create my first goal</span>
            </Button>
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Weightage: {goal.weightage}%
                      </span>
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
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      {hasGoals && !isManager && (
        <div className="mt-6 text-center">
          <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Goal</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalsListComponent;

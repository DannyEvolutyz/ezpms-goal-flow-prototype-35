
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGoals } from '@/contexts/GoalContext';
import { useAuth } from '@/contexts/AuthContext';

interface GoalsListComponentProps {
  onCreateNew?: () => void;
}

const GoalsListComponent: React.FC<GoalsListComponentProps> = ({ onCreateNew }) => {
  const { getGoalsByStatus } = useGoals();
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  
  // Get goals from different statuses
  const draftGoals = getGoalsByStatus('draft');
  const submittedGoals = getGoalsByStatus('submitted');
  const approvedGoals = getGoalsByStatus('approved');
  const rejectedGoals = getGoalsByStatus('rejected');
  const underReviewGoals = getGoalsByStatus('under_review');

  // Group goals by status
  const goalsByStatus = [
    { status: 'Draft', goals: draftGoals, variant: 'outline' },
    { status: 'Submitted', goals: submittedGoals, variant: 'secondary' },
    { status: 'Approved', goals: approvedGoals, variant: 'success' },
    { status: 'Rejected', goals: rejectedGoals, variant: 'destructive' },
    { status: 'Under Review', goals: underReviewGoals, variant: 'warning' },
  ];

  // Check if there are any goals
  const hasGoals = goalsByStatus.some(group => group.goals.length > 0);

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
              {/* Render goals here */}
              {group.goals.map(goal => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{goal.title}</h4>
                  <div className="mt-2 text-sm text-gray-500">{goal.description}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {goal.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
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

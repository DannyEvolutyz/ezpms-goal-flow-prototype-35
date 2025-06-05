
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Goal } from '@/types';
import TeamMemberFilter from './TeamMemberFilter';

interface TeamMember {
  id: string;
  name: string;
}

interface PendingGoalsListProps {
  filteredGoals: Goal[];
  teamMembers: TeamMember[];
  selectedUserId: string;
  selectedGoal: Goal | null;
  onUserChange: (userId: string) => void;
  onSelectGoal: (goal: Goal) => void;
  getGoalOwnerName: (userId: string) => string;
}

const PendingGoalsList: React.FC<PendingGoalsListProps> = ({
  filteredGoals,
  teamMembers,
  selectedUserId,
  selectedGoal,
  onUserChange,
  onSelectGoal,
  getGoalOwnerName
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Goals Pending Review ({filteredGoals.length})
        </CardTitle>
        <TeamMemberFilter
          teamMembers={teamMembers}
          selectedUserId={selectedUserId}
          onUserChange={onUserChange}
        />
      </CardHeader>
      <CardContent>
        {filteredGoals.length > 0 ? (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <div 
                key={goal.id}
                className={`border rounded-lg p-4 cursor-pointer transition hover:border-blue-300 ${
                  selectedGoal?.id === goal.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onSelectGoal(goal)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {getGoalOwnerName(goal.userId)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {goal.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Weightage: {goal.weightage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {selectedUserId === 'all' 
              ? 'No goals pending your review'
              : `No goals pending review from ${teamMembers.find(m => m.id === selectedUserId)?.name || 'selected member'}`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingGoalsList;


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
          <GroupedGoals
            filteredGoals={filteredGoals}
            selectedGoal={selectedGoal}
            onSelectGoal={onSelectGoal}
            getGoalOwnerName={getGoalOwnerName}
            groupByUser={selectedUserId === 'all'}
          />
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

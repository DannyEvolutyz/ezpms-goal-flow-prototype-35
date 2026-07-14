
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Goal } from '@/types';
import TeamMemberFilter from './TeamMemberFilter';

interface GroupedGoalsProps {
  filteredGoals: Goal[];
  selectedGoal: Goal | null;
  onSelectGoal: (goal: Goal) => void;
  getGoalOwnerName: (userId: string) => string;
  groupByUser: boolean;
}

const GoalItem: React.FC<{
  goal: Goal;
  selectedGoal: Goal | null;
  onSelectGoal: (goal: Goal) => void;
  getGoalOwnerName: (userId: string) => string;
  showOwner?: boolean;
}> = ({ goal, selectedGoal, onSelectGoal, getGoalOwnerName, showOwner = true }) => (
  <div
    key={goal.id}
    className={`border rounded-lg p-4 cursor-pointer transition hover:border-primary ${
      selectedGoal?.id === goal.id ? 'border-primary bg-primary/10' : ''
    }`}
    onClick={() => onSelectGoal(goal)}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{goal.title}</h3>
      {showOwner && (
        <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-full">
          {getGoalOwnerName(goal.userId)}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
        {goal.category}
      </span>
      <span className="text-xs text-gray-500">
        Due: {new Date(goal.targetDate).toLocaleDateString()}
      </span>
    </div>
    <div className="mt-2">
      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
        Weightage: {goal.weightage}%
      </span>
    </div>
  </div>
);

const GroupedGoals: React.FC<GroupedGoalsProps> = ({
  filteredGoals,
  selectedGoal,
  onSelectGoal,
  getGoalOwnerName,
  groupByUser,
}) => {
  const groups = useMemo(() => {
    const map = new Map<string, { name: string; goals: Goal[] }>();
    filteredGoals.forEach((g) => {
      const name = getGoalOwnerName(g.userId);
      if (!map.has(g.userId)) map.set(g.userId, { name, goals: [] });
      map.get(g.userId)!.goals.push(g);
    });
    return Array.from(map.entries())
      .map(([userId, v]) => ({ userId, ...v }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredGoals, getGoalOwnerName]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        if (next[g.userId] === undefined) next[g.userId] = true;
      });
      return next;
    });
  }, [groups]);

  if (!groupByUser) {
    return (
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            selectedGoal={selectedGoal}
            onSelectGoal={onSelectGoal}
            getGoalOwnerName={getGoalOwnerName}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isOpen = expanded[group.userId] ?? true;
        return (
          <div key={group.userId} className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [group.userId]: !isOpen }))
              }
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted transition"
            >
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{group.name}</span>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {group.goals.length} {group.goals.length === 1 ? 'goal' : 'goals'}
              </span>
            </button>
            {isOpen && (
              <div className="p-3 space-y-3">
                {group.goals.map((goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    selectedGoal={selectedGoal}
                    onSelectGoal={onSelectGoal}
                    getGoalOwnerName={getGoalOwnerName}
                    showOwner={false}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

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

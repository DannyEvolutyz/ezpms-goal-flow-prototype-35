
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal } from '@/types';

interface TeamMember {
  id: string;
  name: string;
}

interface AllGoalsTabProps {
  filteredGoals: Goal[];
  teamMembers: TeamMember[];
  selectedUserId: string;
  selectedStatus: string;
  selectedGoal: Goal | null;
  onUserChange: (userId: string) => void;
  onStatusChange: (status: string) => void;
  onSelectGoal: (goal: Goal) => void;
  getGoalOwnerName: (userId: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const AllGoalsTab: React.FC<AllGoalsTabProps> = ({
  filteredGoals,
  teamMembers,
  selectedUserId,
  selectedStatus,
  selectedGoal,
  onUserChange,
  onStatusChange,
  onSelectGoal,
  getGoalOwnerName,
  getStatusBadge
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Team Goals</CardTitle>
          <div className="flex gap-4">
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="final_approved">Final Approved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedUserId} onValueChange={onUserChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGoals.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              No goals found matching the selected filters.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map(goal => (
                <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => onSelectGoal(goal)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-600">by {getGoalOwnerName(goal.userId)}</p>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    <span>Updated: {new Date(goal.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedGoal && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Goal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedGoal.title}</h3>
                <p className="text-sm text-gray-600">by {getGoalOwnerName(selectedGoal.userId)}</p>
              </div>
              <div>
                <p className="text-sm">{selectedGoal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {selectedGoal.category}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> {selectedGoal.priority}
                </div>
                <div>
                  <span className="font-medium">Target Date:</span> {new Date(selectedGoal.targetDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Weightage:</span> {selectedGoal.weightage}%
                </div>
              </div>
              {selectedGoal.feedback && (
                <div>
                  <span className="font-medium">Feedback:</span>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedGoal.feedback}</p>
                </div>
              )}
              {selectedGoal.milestones && selectedGoal.milestones.length > 0 && (
                <div>
                  <span className="font-medium">Milestones:</span>
                  <ul className="text-sm space-y-1 mt-1">
                    {selectedGoal.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className={milestone.completed ? 'text-green-600' : 'text-gray-500'}>
                          {milestone.completed ? '✓' : '○'}
                        </span>
                        {milestone.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AllGoalsTab;

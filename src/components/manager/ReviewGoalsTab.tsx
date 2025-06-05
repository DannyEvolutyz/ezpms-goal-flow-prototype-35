
import React from 'react';
import PendingGoalsList from './PendingGoalsList';
import GoalReviewPanel from './GoalReviewPanel';
import { Goal } from '@/types';

interface TeamMember {
  id: string;
  name: string;
}

interface ReviewGoalsTabProps {
  pendingGoals: Goal[];
  teamMembers: TeamMember[];
  selectedUserId: string;
  selectedGoal: Goal | null;
  feedback: string;
  onUserChange: (userId: string) => void;
  onSelectGoal: (goal: Goal) => void;
  onFeedbackChange: (feedback: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onReturnForRevision: () => void;
  getGoalOwnerName: (userId: string) => string;
}

const ReviewGoalsTab: React.FC<ReviewGoalsTabProps> = ({
  pendingGoals,
  teamMembers,
  selectedUserId,
  selectedGoal,
  feedback,
  onUserChange,
  onSelectGoal,
  onFeedbackChange,
  onApprove,
  onReject,
  onReturnForRevision,
  getGoalOwnerName
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PendingGoalsList
        filteredGoals={pendingGoals}
        teamMembers={teamMembers}
        selectedUserId={selectedUserId}
        selectedGoal={selectedGoal}
        onUserChange={onUserChange}
        onSelectGoal={onSelectGoal}
        getGoalOwnerName={getGoalOwnerName}
      />
      
      {selectedGoal && (
        <GoalReviewPanel
          selectedGoal={selectedGoal}
          feedback={feedback}
          onFeedbackChange={onFeedbackChange}
          onApprove={onApprove}
          onReject={onReject}
          onReturnForRevision={onReturnForRevision}
          getGoalOwnerName={getGoalOwnerName}
        />
      )}
    </div>
  );
};

export default ReviewGoalsTab;

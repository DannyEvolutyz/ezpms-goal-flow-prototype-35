
import React, { useState } from 'react';
import { Goal } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import GoalStatus from './goal-card/GoalStatus';
import GoalWeightage from './goal-card/GoalWeightage';
import GoalFeedback from './goal-card/GoalFeedback';
import GoalMilestones from './goal-card/GoalMilestones';
import GoalActions from './goal-card/GoalActions';
import SelfRatingDialog from '../SelfRatingDialog';
import { useGoals } from '@/contexts/goal';

interface GoalCardProps {
  goal: Goal;
  effectiveReadOnly: boolean;
  onEditGoal: (goalId: string) => void;
  onSubmitGoal: (goalId: string) => void;
  onSendForApproval: (goalId: string) => void;
  onUpdateWeightage: (goalId: string, weightage: number) => void;
  showSubmitOption?: boolean;
  showApprovalOption?: boolean;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (goalId: string, selected: boolean) => void;
  totalWeightage?: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  effectiveReadOnly, 
  onEditGoal, 
  onSubmitGoal,
  onSendForApproval,
  onUpdateWeightage,
  showSubmitOption = false,
  showApprovalOption = false,
  showCheckbox = false,
  isSelected = false,
  onToggleSelect,
  totalWeightage = 0
}) => {
  const { canRateGoals } = useGoals();
  const [selfRateOpen, setSelfRateOpen] = useState(false);

  const isApproved = goal.status === 'approved' || goal.status === 'submitted' || goal.status === 'final_approved';
  const isLocked = isApproved || goal.status === 'pending_approval';

  const canEdit = !effectiveReadOnly && (goal.status === 'draft' || goal.status === 'rejected' || goal.status === 'under_review');
  const canSendForApproval = !effectiveReadOnly && goal.status === 'draft';
  const canSendRejectedForApproval = !effectiveReadOnly && goal.status === 'rejected';
  const canSubmit = false;

  const ratingOpen = canRateGoals(goal.spaceId);
  const canSelfRate = ratingOpen && (goal.status === 'approved' || goal.status === 'final_approved');
  const alreadySelfRated = !!goal.selfRatedAt;

  const handleUpdateWeightage = (weightage: number) => {
    onUpdateWeightage(goal.id, weightage);
  };

  const handleEditGoal = () => {
    console.log('handleEditGoal called in GoalCard for goal:', goal.id);
    console.log('onEditGoal prop:', onEditGoal);
    console.log('canEdit:', canEdit);
    console.log('effectiveReadOnly:', effectiveReadOnly);
    console.log('goal.status:', goal.status);
    
    if (onEditGoal) {
      onEditGoal(goal.id);
    } else {
      console.error('onEditGoal prop is not provided to GoalCard');
    }
  };

  const handleSendForApproval = () => {
    onSendForApproval(goal.id);
  };

  const handleSubmitGoal = () => {
    onSubmitGoal(goal.id);
  };

  const handleToggleSelect = (checked: boolean) => {
    if (onToggleSelect) {
      onToggleSelect(goal.id, checked);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${isApproved ? 'bg-green-50 border-green-200' : ''} ${goal.status === 'under_review' ? 'bg-purple-50 border-purple-200' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {showCheckbox && (canSendForApproval || canSendRejectedForApproval) && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggleSelect}
            />
          )}
          <h4 className="font-medium">{goal.title}</h4>
        </div>
        <GoalStatus status={goal.status} isLocked={isLocked} />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">{goal.description}</div>

      <GoalWeightage
        weightage={goal.weightage}
        isLocked={isLocked}
        effectiveReadOnly={effectiveReadOnly}
        onUpdateWeightage={handleUpdateWeightage}
        goalStatus={goal.status}
      />

      <GoalFeedback feedback={goal.feedback} status={goal.status} />

      <GoalMilestones milestones={goal.milestones} />
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {goal.category}
        </span>
        <span className="text-xs text-gray-500">
          Due: {new Date(goal.targetDate).toLocaleDateString()}
        </span>
      </div>
      
      <GoalActions
        canEdit={canEdit}
        canSendForApproval={(canSendForApproval && !showCheckbox) || canSendRejectedForApproval}
        canSubmit={canSubmit}
        showSubmitOption={showSubmitOption}
        showApprovalOption={showApprovalOption}
        onEditGoal={handleEditGoal}
        onSendForApproval={handleSendForApproval}
        onSubmitGoal={handleSubmitGoal}
        totalWeightage={totalWeightage}
      />

      {canSelfRate && (
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          {alreadySelfRated ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Self-rated {goal.selfRating}/5
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Rating window is open. Submit your self-rating.</span>
          )}
          <Button size="sm" variant={alreadySelfRated ? 'outline' : 'default'} onClick={() => setSelfRateOpen(true)}>
            <Star className="h-3 w-3 mr-1" />
            {alreadySelfRated ? 'Update self-rating' : 'Self-Rate'}
          </Button>
        </div>
      )}

      <SelfRatingDialog goal={goal} open={selfRateOpen} onOpenChange={setSelfRateOpen} />
    </div>
  );
};

export default GoalCard;

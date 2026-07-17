
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ArrowDown, Star } from 'lucide-react';
import { Goal } from '@/types';
import { useGoals } from '@/contexts/goal';

interface GoalReviewPanelProps {
  selectedGoal: Goal;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onReturnForRevision: () => void;
  onRateGoal?: (rating: number, comment: string) => void;
  getGoalOwnerName: (userId: string) => string;
}

const GoalReviewPanel: React.FC<GoalReviewPanelProps> = ({
  selectedGoal,
  feedback,
  onFeedbackChange,
  onApprove,
  onReject,
  onReturnForRevision,
  onRateGoal,
  getGoalOwnerName
}) => {
  const { canRateGoals, spaces } = useGoals();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const goalSpace = spaces.find(s => s.id === selectedGoal.spaceId);
  const isGoalSettingSpace = goalSpace?.spaceKind === 'goal_setting';
  const isCycleSpace = goalSpace?.spaceKind === 'cycle';
  const ratingWindowOpen = isCycleSpace && canRateGoals(selectedGoal.spaceId);
  const memberHasSelfRated = !!selectedGoal.selfRatedAt;
  // Rate Goals view is shown for any approved-onward goal; but only cycle spaces during rating window allow actions
  const isRatingMode = selectedGoal.status !== 'pending_approval' && selectedGoal.status !== 'draft';
  const canManagerRate = ratingWindowOpen && memberHasSelfRated && selectedGoal.status !== 'final_approved';

  const handleRateGoal = () => {
    if (onRateGoal && rating > 0) {
      onRateGoal(rating, ratingComment);
      setRating(0);
      setRatingComment('');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={starValue}
          type="button"
          className={`text-2xl transition-colors ${
            starValue <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } hover:text-yellow-400`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isRatingMode ? 'Rate Goal' : 'Review Goal'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Goal by: {getGoalOwnerName(selectedGoal.userId)}
        </p>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium text-lg">{selectedGoal.title}</h3>
        <p className="text-gray-600 mt-1">{selectedGoal.description}</p>
        
        <div className="mt-4 space-y-2">
          <div>
            <span className="text-sm font-medium">Category:</span>
            <span className="ml-2 text-sm">{selectedGoal.category}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Priority:</span>
            <span className="ml-2 text-sm">{selectedGoal.priority}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Weightage:</span>
            <span className="ml-2 text-sm">{selectedGoal.weightage}%</span>
          </div>
          <div>
            <span className="text-sm font-medium">Target Date:</span>
            <span className="ml-2 text-sm">
              {new Date(selectedGoal.targetDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {selectedGoal.milestones && selectedGoal.milestones.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Milestones:</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {selectedGoal.milestones.map((milestone) => (
                <li key={milestone.id}>{milestone.title}</li>
              ))}
            </ul>
          </div>
        )}

        {isRatingMode ? (
          <div className="mt-6 space-y-4">
            {isGoalSettingSpace && (
              <div className="rounded-md border bg-blue-50 p-3 text-sm text-blue-800">
                This goal is in the Goal Setting space and is view-only here. Rating happens in the cycle sub-spaces during their rating window.
              </div>
            )}
            {isCycleSpace && !ratingWindowOpen && selectedGoal.status !== 'final_approved' && (
              <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                Rating window for this cycle is not open yet. You'll be able to rate during the configured rating dates.
              </div>
            )}
            {selectedGoal.status === 'final_approved' && selectedGoal.rating && (
              <div className="rounded-md border bg-emerald-50 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  Manager rating: {selectedGoal.rating}/5
                </div>
                {selectedGoal.ratingComment && (
                  <p className="mt-1 text-muted-foreground">"{selectedGoal.ratingComment}"</p>
                )}
              </div>
            )}
            {memberHasSelfRated ? (
              <div className="rounded-md border bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Member self-rated: {selectedGoal.selfRating}/5
                </div>
                {selectedGoal.selfRatingComment && (
                  <p className="mt-1 text-sm text-muted-foreground">"{selectedGoal.selfRatingComment}"</p>
                )}
              </div>
            ) : isCycleSpace ? (
              <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                Waiting for the member to submit their self-rating before you can rate this goal.
              </div>
            ) : null}

            {isCycleSpace && selectedGoal.status !== 'final_approved' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Manager Rating</label>
                  <div className="flex gap-1">{renderStars()}</div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600 mt-1">{rating} out of 5 stars</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Comments</label>
                  <Textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Add your comments about this goal's performance"
                    className="w-full h-24"
                    disabled={!canManagerRate}
                  />
                </div>

                <Button
                  onClick={handleRateGoal}
                  disabled={rating === 0 || !canManagerRate}
                  className="w-full"
                >
                  Submit Rating & Comments
                </Button>
              </>
            )}
          </div>
        ) : (
          // Review interface for pending goals
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Enter feedback for the employee"
              className="w-full h-24"
            />
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={onApprove}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
              <Button
                onClick={onReturnForRevision}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <ArrowDown className="h-4 w-4" />
                <span>Request Revisions</span>
              </Button>
              <Button
                onClick={onReject}
                variant="destructive"
                className="flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalReviewPanel;

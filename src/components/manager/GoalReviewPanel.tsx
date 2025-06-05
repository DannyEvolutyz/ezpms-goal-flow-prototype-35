
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ArrowDown, Star } from 'lucide-react';
import { Goal } from '@/types';

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
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const isSubmittedGoal = selectedGoal.status === 'submitted';

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
          {isSubmittedGoal ? 'Rate Goal' : 'Review Goal'}
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

        {isSubmittedGoal ? (
          // Rating interface for submitted goals
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">{renderStars()}</div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {rating} out of 5 stars
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <Textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Add your comments about this goal's performance"
                className="w-full h-24"
              />
            </div>

            <Button
              onClick={handleRateGoal}
              disabled={rating === 0}
              className="w-full"
            >
              Submit Rating & Comments
            </Button>
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

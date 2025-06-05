
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ArrowDown } from 'lucide-react';
import { Goal } from '@/types';

interface GoalReviewPanelProps {
  selectedGoal: Goal;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onReturnForRevision: () => void;
  getGoalOwnerName: (userId: string) => string;
}

const GoalReviewPanel: React.FC<GoalReviewPanelProps> = ({
  selectedGoal,
  feedback,
  onFeedbackChange,
  onApprove,
  onReject,
  onReturnForRevision,
  getGoalOwnerName
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review Goal</CardTitle>
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
        
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <Textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Enter feedback for the employee"
            className="w-full h-24"
          />
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default GoalReviewPanel;

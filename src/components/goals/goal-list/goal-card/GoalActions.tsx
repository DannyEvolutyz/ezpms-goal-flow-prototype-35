
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Send } from 'lucide-react';

interface GoalActionsProps {
  canEdit: boolean;
  canSendForApproval: boolean;
  canSubmit: boolean;
  showSubmitOption: boolean;
  showApprovalOption: boolean;
  onEditGoal: () => void;
  onSendForApproval: () => void;
  onSubmitGoal: () => void;
}

const GoalActions: React.FC<GoalActionsProps> = ({
  canEdit,
  canSendForApproval,
  canSubmit,
  showSubmitOption,
  showApprovalOption,
  onEditGoal,
  onSendForApproval,
  onSubmitGoal,
}) => {
  const hasActions = canEdit || (canSendForApproval && showApprovalOption) || (canSubmit && showSubmitOption);

  if (!hasActions) {
    return null;
  }

  return (
    <div className="mt-4 flex justify-end space-x-2">
      {canEdit && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEditGoal}
          className="text-xs"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      )}
      
      {canSendForApproval && showApprovalOption && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSendForApproval}
          className="text-xs"
        >
          <Send className="h-3 w-3 mr-1" />
          Send for Approval
        </Button>
      )}
      
      {canSubmit && showSubmitOption && (
        <Button
          size="sm"
          onClick={onSubmitGoal}
          className="text-xs"
        >
          <Send className="h-3 w-3 mr-1" />
          Submit for Review
        </Button>
      )}
    </div>
  );
};

export default GoalActions;

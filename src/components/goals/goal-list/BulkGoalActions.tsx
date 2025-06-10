
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Send } from 'lucide-react';

interface BulkGoalActionsProps {
  selectedGoalIds: string[];
  totalSelectableGoals: number;
  onSelectAll: (checked: boolean) => void;
  onSendSelectedForApproval: () => void;
  effectiveReadOnly: boolean;
  actionLabel?: string;
  selectLabel?: string;
}

const BulkGoalActions: React.FC<BulkGoalActionsProps> = ({
  selectedGoalIds,
  totalSelectableGoals,
  onSelectAll,
  onSendSelectedForApproval,
  effectiveReadOnly,
  actionLabel = "Send Selected for Approval",
  selectLabel = "goals"
}) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const isAllSelected = selectedGoalIds.length === totalSelectableGoals && totalSelectableGoals > 0;
  const isIndeterminate = selectedGoalIds.length > 0 && selectedGoalIds.length < totalSelectableGoals;

  useEffect(() => {
    if (checkboxRef.current) {
      (checkboxRef.current as any).indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  if (totalSelectableGoals === 0 || effectiveReadOnly) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center space-x-2">
        <Checkbox
          ref={checkboxRef}
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm font-medium">
          {selectedGoalIds.length === 0 
            ? `Select all ${totalSelectableGoals} ${selectLabel}`
            : `${selectedGoalIds.length} of ${totalSelectableGoals} ${selectLabel} selected`
          }
        </span>
      </div>
      
      {selectedGoalIds.length > 0 && (
        <Button
          onClick={onSendSelectedForApproval}
          className="text-xs"
          size="sm"
        >
          <Send className="h-3 w-3 mr-1" />
          {actionLabel} ({selectedGoalIds.length})
        </Button>
      )}
    </div>
  );
};

export default BulkGoalActions;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NoGoalsMessageProps {
  onCreateNew: () => void;
  isManager: boolean;
  effectiveReadOnly: boolean;
}

const NoGoalsMessage: React.FC<NoGoalsMessageProps> = ({ 
  onCreateNew, 
  isManager, 
  effectiveReadOnly 
}) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
      <p className="text-gray-500 mb-4">You haven't created any goals in this space yet.</p>
      {!isManager && !effectiveReadOnly && (
        <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Create my first goal</span>
        </Button>
      )}
      {effectiveReadOnly && (
        <p className="text-sm text-muted-foreground">
          You can no longer create goals in this space as the submission deadline has passed.
        </p>
      )}
    </div>
  );
};

export default NoGoalsMessage;

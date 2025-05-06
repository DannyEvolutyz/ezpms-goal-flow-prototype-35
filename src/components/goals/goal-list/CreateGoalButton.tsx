
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateGoalButtonProps {
  onCreateNew: () => void;
}

const CreateGoalButton: React.FC<CreateGoalButtonProps> = ({ onCreateNew }) => {
  return (
    <div className="mt-6 text-center">
      <Button onClick={onCreateNew} className="inline-flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span>Create New Goal</span>
      </Button>
    </div>
  );
};

export default CreateGoalButton;

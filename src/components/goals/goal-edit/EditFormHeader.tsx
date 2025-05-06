
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditFormHeaderProps {
  onBack: () => void;
}

const EditFormHeader: React.FC<EditFormHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="p-0 h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold text-blue-600">Edit Goal</h2>
    </div>
  );
};

export default EditFormHeader;

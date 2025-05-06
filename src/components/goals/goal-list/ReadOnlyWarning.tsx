
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ReadOnlyWarning: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center gap-3 mb-4">
      <AlertCircle className="h-5 w-5 text-amber-500" />
      <p className="text-amber-800 text-sm">
        This goal space is now read-only. You can view goals but cannot create, edit, or submit them.
      </p>
    </div>
  );
};

export default ReadOnlyWarning;

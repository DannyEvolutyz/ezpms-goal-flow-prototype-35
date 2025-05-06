
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ReadOnlyAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-800">Read-only Goal</AlertTitle>
      <AlertDescription className="text-amber-700">
        This goal belongs to a space that is now read-only. You can view the details but cannot make changes.
      </AlertDescription>
    </Alert>
  );
};

export default ReadOnlyAlert;

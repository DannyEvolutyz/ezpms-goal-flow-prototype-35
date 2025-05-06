
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FeedbackAlertProps {
  feedback: string;
}

const FeedbackAlert: React.FC<FeedbackAlertProps> = ({ feedback }) => {
  if (!feedback) return null;
  
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertTitle className="text-blue-800">Manager Feedback</AlertTitle>
      <AlertDescription className="text-blue-700">
        {feedback}
      </AlertDescription>
    </Alert>
  );
};

export default FeedbackAlert;

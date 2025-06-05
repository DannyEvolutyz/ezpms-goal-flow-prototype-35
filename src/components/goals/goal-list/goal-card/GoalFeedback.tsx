
import React from 'react';

interface GoalFeedbackProps {
  feedback?: string;
  status: string;
}

const GoalFeedback: React.FC<GoalFeedbackProps> = ({ feedback, status }) => {
  if (!feedback || (status !== 'rejected' && status !== 'under_review')) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-sm font-medium text-amber-800">Manager Feedback:</p>
      <p className="text-sm text-amber-700 mt-1">{feedback}</p>
      {status === 'under_review' && (
        <p className="text-sm text-purple-700 mt-2 font-medium">
          ✏️ You can now edit this goal to address the feedback.
        </p>
      )}
    </div>
  );
};

export default GoalFeedback;

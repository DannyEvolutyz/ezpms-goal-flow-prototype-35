
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useGoals } from '@/contexts/goal';
import { Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import EditFormHeader from './goal-edit/EditFormHeader';
import ReadOnlyAlert from './goal-edit/ReadOnlyAlert';
import FeedbackAlert from './goal-edit/FeedbackAlert';
import EditFormFields from './goal-edit/EditFormFields';
import { goalFormSchema } from './goalFormSchema';
import { GoalFormValues } from './goalFormSchema';

interface GoalEditFormProps {
  goal: Goal;
  onCancel: () => void;
}

const GoalEditForm = ({ goal, onCancel }: GoalEditFormProps) => {
  const { updateGoal, isSpaceReadOnly } = useGoals();
  const isSpaceReadOnlyState = isSpaceReadOnly(goal.spaceId);
  
  // Allow editing if goal is under review, even if space is normally read-only
  const isReadOnly = isSpaceReadOnlyState && goal.status !== 'under_review';
  
  // Initialize the form with goal data
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: goal.title,
      description: goal.description,
      category: goal.category as any,
      priority: goal.priority,
      targetDate: new Date(goal.targetDate),
    },
  });

  // Handle form submission
  const onSubmit = (data: GoalFormValues) => {
    if (isReadOnly) {
      toast({
        title: "Cannot update goal",
        description: "This goal belongs to a read-only space.",
        variant: "destructive"
      });
      return;
    }
    
    updateGoal({
      ...goal,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      // Keep the status unchanged
    });
    
    toast({
      title: "Goal updated",
      description: goal.status === 'under_review' 
        ? "Your goal has been updated. You can now send it for approval again."
        : "Your goal has been updated successfully.",
      variant: "default"
    });
    
    onCancel(); // Return to the list view
  };

  return (
    <div className="space-y-6">
      <EditFormHeader onBack={onCancel} />
      
      {isReadOnly && <ReadOnlyAlert />}
      <FeedbackAlert feedback={goal.feedback || ''} />
      
      {goal.status === 'under_review' && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-purple-800 text-sm">
              ✏️ <strong>Revision Requested:</strong> Your manager has requested changes to this goal. 
              Please review the feedback above and make necessary updates. After editing, you can send it for approval again.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Goal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditFormFields 
            form={form} 
            onSubmit={onSubmit} 
            onCancel={onCancel}
            isReadOnly={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalEditForm;

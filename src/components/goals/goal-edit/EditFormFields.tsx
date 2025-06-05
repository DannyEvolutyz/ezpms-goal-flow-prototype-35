
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import GoalTitleField from '../GoalTitleField';
import GoalDescriptionField from '../GoalDescriptionField';
import GoalCategorySelector from '../GoalCategorySelector';
import GoalPrioritySelector from '../GoalPrioritySelector';
import GoalTargetDatePicker from '../GoalTargetDatePicker';
import MilestonesArrayField from '../MilestonesArrayField';

interface EditFormFieldsProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isReadOnly: boolean;
}

const EditFormFields: React.FC<EditFormFieldsProps> = ({
  form,
  onSubmit,
  onCancel,
  isReadOnly
}) => {
  const milestoneFieldArray = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <GoalTitleField form={form} />
        <GoalDescriptionField form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoalCategorySelector form={form} />
          <GoalPrioritySelector form={form} />
        </div>
        
        <GoalTargetDatePicker form={form} isReadOnly={isReadOnly} />
        
        {!isReadOnly && (
          <MilestonesArrayField form={form} fieldArray={milestoneFieldArray} />
        )}
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          {!isReadOnly && <Button type="submit">Save Changes</Button>}
        </div>
      </form>
    </Form>
  );
};

export default EditFormFields;

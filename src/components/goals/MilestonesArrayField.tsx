
// Imports
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FormMessage } from '@/components/ui/form';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import MilestoneRowItem from './MilestoneRowItem';

type MilestoneField = {
  title: string;
  description?: string;
  completed?: boolean;
  targetDate?: Date | undefined;
};

interface MilestonesArrayFieldProps {
  form: UseFormReturn<any>;
  fieldArray: UseFieldArrayReturn<any, 'milestones', 'id'>;
}

const MilestonesArrayField = ({ form, fieldArray }: MilestonesArrayFieldProps) => {
  const { fields, append, remove } = fieldArray;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Plus className="h-4 w-4 text-blue-400" />
        <span className="font-medium text-blue-700">
          Milestones <span className="text-gray-500 font-normal">(optional)</span>
        </span>
      </div>
      {fields.length === 0 ? (
        <p className="text-xs text-muted-foreground mb-2 ml-[30px]">Break down your goal into steps for better tracking.</p>
      ) : null}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <MilestoneRowItem
            key={field.id}
            index={index}
            form={form}
            remove={remove}
          />
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2"
          disabled={fields.length >= 10}
          onClick={() => append({ title: '', description: '', completed: false, targetDate: undefined })}
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </Button>
      </div>
      {form.formState.errors.milestones && (
        <FormMessage>
          {form.formState.errors.milestones.message as string}
        </FormMessage>
      )}
    </div>
  );
};

export default MilestonesArrayField;

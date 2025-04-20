
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

type MilestoneField = {
  title: string;
  description?: string;
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
        {/* Use Plus icon for milestone section instead of Milestone icon (not in allowed set) */}
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
          <div key={field.id} className="flex gap-2 items-start">
            <Input
              className="flex-1"
              placeholder={`Milestone ${index + 1} title`}
              {...form.register(`milestones.${index}.title` as const)}
            />
            <Textarea
              className="w-48 text-xs"
              placeholder="Milestone description (optional)"
              {...form.register(`milestones.${index}.description` as const)}
              rows={2}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="mt-1 text-red-500"
              aria-label="Remove"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2"
          disabled={fields.length >= 10}
          onClick={() => append({ title: '', description: '' })}
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

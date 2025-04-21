
// Add imports for date picker and checkbox
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage } from '@/components/ui/form';
import { Plus, Trash2, Calendar as CalendarIcon, Check as CheckIcon } from 'lucide-react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
          <div key={field.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            {/* Completed Checkbox */}
            <button
              type="button"
              aria-label="Mark milestone complete"
              className={cn(
                "h-8 w-8 flex items-center justify-center border rounded transition",
                form.watch(`milestones.${index}.completed`) ? "bg-green-200 border-green-400" : "bg-gray-100"
              )}
              onClick={() => {
                const current = form.getValues(`milestones.${index}.completed`);
                form.setValue(`milestones.${index}.completed`, !current);
              }}
            >
              {form.watch(`milestones.${index}.completed`) && (
                <CheckIcon className="text-green-600" />
              )}
            </button>
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
            {/* Target Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "pl-3 min-w-[120px] text-left font-normal",
                    !form.watch(`milestones.${index}.targetDate`) && "text-muted-foreground"
                  )}
                  type="button"
                >
                  {form.watch(`milestones.${index}.targetDate`)
                    ? (typeof form.watch(`milestones.${index}.targetDate`) === "string"
                      ? new Date(form.watch(`milestones.${index}.targetDate`)).toLocaleDateString()
                      : (form.watch(`milestones.${index}.targetDate`) as Date).toLocaleDateString())
                    : <span>Target date</span>
                  }
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch(`milestones.${index}.targetDate`)
                    ? typeof form.watch(`milestones.${index}.targetDate`) === "string"
                      ? new Date(form.watch(`milestones.${index}.targetDate`)
                  ) : form.watch(`milestones.${index}.targetDate`) : undefined}
                  onSelect={date => form.setValue(`milestones.${index}.targetDate`, date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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

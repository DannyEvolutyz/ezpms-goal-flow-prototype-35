
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import GoalTitleField from '../GoalTitleField';
import GoalDescriptionField from '../GoalDescriptionField';
import GoalCategorySelector from '../GoalCategorySelector';
import GoalPrioritySelector from '../GoalPrioritySelector';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <GoalTitleField form={form} />
        <GoalDescriptionField form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoalCategorySelector form={form} />
          <GoalPrioritySelector form={form} />
        </div>
        
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Completion Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild disabled={isReadOnly}>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        isReadOnly && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isReadOnly}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || isReadOnly}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          {!isReadOnly && <Button type="submit">Save Changes</Button>}
        </div>
      </form>
    </Form>
  );
};

export default EditFormFields;

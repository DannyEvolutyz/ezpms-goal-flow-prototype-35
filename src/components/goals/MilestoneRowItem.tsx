
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Popover, PopoverContent, PopoverTrigger } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Trash2, Check as CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseMilestoneTargetDate } from './milestoneDateHelpers';

interface MilestoneRowItemProps {
  index: number;
  form: any;
  remove: (index: number) => void;
}

const MilestoneRowItem = ({ index, form, remove }: MilestoneRowItemProps) => {
  // Date formatting through helper, works for string or Date
  const targetDate = parseMilestoneTargetDate(form.watch(`milestones.${index}.targetDate`));

  return (
    <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
      {/* Completed Checkbox Display Button */}
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
              !targetDate && "text-muted-foreground"
            )}
            type="button"
          >
            {targetDate
              ? targetDate.toLocaleDateString()
              : <span>Target date</span>
            }
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={targetDate}
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
  );
};

export default MilestoneRowItem;

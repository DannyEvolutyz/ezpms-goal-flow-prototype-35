
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Trash2, Check as CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseMilestoneTargetDate } from './milestoneDateHelpers';
import { useState } from 'react';

interface MilestoneRowItemProps {
  index: number;
  form: any;
  remove: (index: number) => void;
}

const MilestoneRowItem = ({ index, form, remove }: MilestoneRowItemProps) => {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const targetDate = parseMilestoneTargetDate(form.watch(`milestones.${index}.targetDate`));
  const isCompleted = form.watch(`milestones.${index}.completed`);

  const handleCompletion = (comment: string) => {
    form.setValue(`milestones.${index}.completed`, true);
    form.setValue(`milestones.${index}.completionComment`, comment);
    setShowCommentDialog(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <button
          type="button"
          aria-label="Mark milestone complete"
          className={cn(
            "h-8 w-8 flex items-center justify-center border rounded transition",
            isCompleted ? "bg-green-200 border-green-400" : "bg-gray-100"
          )}
          onClick={() => !isCompleted && setShowCommentDialog(true)}
        >
          {isCompleted && <CheckIcon className="text-green-600" />}
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
            />
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="mt-1 text-red-500"
          onClick={() => remove(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Completion Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter comment about milestone completion..."
            {...form.register(`milestones.${index}.completionComment`)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCompletion(form.getValues(`milestones.${index}.completionComment`))}>
              Complete Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MilestoneRowItem;

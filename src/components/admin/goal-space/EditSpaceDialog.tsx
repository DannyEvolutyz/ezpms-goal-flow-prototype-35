import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock } from 'lucide-react';
import { useGoals } from '@/contexts/goal';
import { toast } from '@/hooks/use-toast';
import { GoalSpace } from '@/types';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import DateField from './DateField';

const base = {
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().optional(),
  isActive: z.boolean(),
};

const parentSchema = z.object({ ...base });

const goalSettingSchema = z.object({
  ...base,
  startDate: z.date({ required_error: 'Start date is required' }),
  submissionDeadline: z.date({ required_error: 'Submission deadline is required' }),
  reviewDeadline: z.date({ required_error: 'Review deadline is required' }),
}).refine(d => d.startDate <= d.submissionDeadline, { message: 'Submission must be on/after start', path: ['submissionDeadline'] })
  .refine(d => d.submissionDeadline <= d.reviewDeadline, { message: 'Review must be on/after submission', path: ['reviewDeadline'] });

const cycleSchema = z.object({
  ...base,
  editStartDate: z.date({ required_error: 'Edit start date is required' }),
  editEndDate: z.date({ required_error: 'Edit end date is required' }),
  ratingStartDate: z.date({ required_error: 'Rating start date is required' }),
  ratingDeadline: z.date({ required_error: 'Rating deadline is required' }),
}).refine(d => d.editStartDate <= d.editEndDate, { message: 'Edit end must be on/after edit start', path: ['editEndDate'] })
  .refine(d => d.editEndDate <= d.ratingStartDate, { message: 'Rating start must be on/after edit end', path: ['ratingStartDate'] })
  .refine(d => d.ratingStartDate <= d.ratingDeadline, { message: 'Rating end must be on/after rating start', path: ['ratingDeadline'] });

const toDate = (v?: string | null) => (v ? new Date(v) : undefined);
const toIso = (d?: Date) => (d ? d.toISOString() : null);

interface EditSpaceDialogProps {
  space: GoalSpace;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const EditSpaceDialog = ({ space, open, onOpenChange }: EditSpaceDialogProps) => {
  const { updateGoalSpace } = useGoals();
  const kind = space.spaceKind;
  const schema = kind === 'parent' ? parentSchema : kind === 'goal_setting' ? goalSettingSchema : cycleSchema;

  const defaults: any = {
    name: space.name,
    description: space.description || '',
    isActive: space.isActive,
    startDate: toDate(space.startDate),
    submissionDeadline: toDate(space.submissionDeadline),
    reviewDeadline: toDate(space.reviewDeadline),
    editStartDate: toDate(space.editStartDate),
    editEndDate: toDate(space.editEndDate),
    ratingStartDate: toDate(space.ratingStartDate),
    ratingDeadline: toDate(space.ratingDeadline),
  };

  const form = useForm<any>({ resolver: zodResolver(schema as any), defaultValues: defaults });

  useEffect(() => {
    if (open) form.reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, space.id]);

  const onSubmit = async (values: any) => {
    try {
      const payload: any = {
        name: values.name,
        description: values.description || '',
        isActive: values.isActive,
      };
      if (kind === 'goal_setting') {
        payload.startDate = toIso(values.startDate);
        payload.submissionDeadline = toIso(values.submissionDeadline);
        payload.reviewDeadline = toIso(values.reviewDeadline);
      }
      if (kind === 'cycle') {
        payload.editStartDate = toIso(values.editStartDate);
        payload.editEndDate = toIso(values.editEndDate);
        payload.ratingStartDate = toIso(values.ratingStartDate);
        payload.ratingDeadline = toIso(values.ratingDeadline);
      }
      await updateGoalSpace(space.id, payload);
      toast({ title: 'Saved', description: `"${values.name}" has been updated.` });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not update this space', variant: 'destructive' });
    }
  };

  const title = kind === 'parent' ? 'Edit Goal Space' : kind === 'goal_setting' ? 'Edit Goal Setting' : 'Edit Sub-Space';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {kind === 'parent'
              ? 'Rename this container or pause it. Timelines live on its sub-spaces.'
              : 'Update the name, description and timeline. Existing goals are not affected.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (optional)</FormLabel><FormControl><Textarea className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {kind !== 'parent' && (
              <Alert className="bg-blue-50 border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Timeline</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  {kind === 'goal_setting'
                    ? 'Order: Start → Submission → Review.'
                    : 'Order: Edit Start → Edit End → Rating Start → Rating End.'}
                </AlertDescription>
              </Alert>
            )}

            {kind === 'goal_setting' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DateField form={form} name="startDate" label="Start Date" description="When users can start creating goals" />
                <DateField form={form} name="submissionDeadline" label="Submission Deadline" description="Last day to submit goals" />
                <DateField form={form} name="reviewDeadline" label="Review Deadline" description="Last day for manager review" />
              </div>
            )}

            {kind === 'cycle' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateField form={form} name="editStartDate" label="Edit Start Date" description="When members can update goal progress" />
                  <DateField form={form} name="editEndDate" label="Edit End Date" description="Last day to update progress" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateField form={form} name="ratingStartDate" label="Rating Start Date" description="Self- and manager-rating opens" />
                  <DateField form={form} name="ratingDeadline" label="Rating Deadline" description="Last day to rate goals" />
                </div>
              </>
            )}

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <FormLabel>Active</FormLabel>
                  <FormDescription className="text-xs">Inactive spaces become read-only and are hidden from members.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpaceDialog;

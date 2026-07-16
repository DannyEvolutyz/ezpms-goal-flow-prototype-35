
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FolderPlus, Trash2, Clock, ChevronDown, ChevronRight, Plus, Folder, Lock } from 'lucide-react';
import { useGoals } from '@/contexts/goal';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { GoalSpace } from '@/types';

import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const parentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  submissionDeadline: z.date({ required_error: 'Submission deadline is required' }),
  reviewDeadline: z.date({ required_error: 'Review deadline is required' }),
}).refine(d => d.startDate <= d.submissionDeadline, { message: 'Submission must be on/after start', path: ['submissionDeadline'] })
  .refine(d => d.submissionDeadline <= d.reviewDeadline, { message: 'Review must be on/after submission', path: ['reviewDeadline'] });

const cycleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().optional(),
  editStartDate: z.date({ required_error: 'Edit start date is required' }),
  editEndDate: z.date({ required_error: 'Edit end date is required' }),
  ratingStartDate: z.date({ required_error: 'Rating start date is required' }),
  ratingDeadline: z.date({ required_error: 'Rating deadline is required' }),
}).refine(d => d.editStartDate <= d.editEndDate, { message: 'Edit end must be on/after edit start', path: ['editEndDate'] })
  .refine(d => d.editEndDate <= d.ratingStartDate, { message: 'Rating start must be on/after edit end', path: ['ratingStartDate'] })
  .refine(d => d.ratingStartDate <= d.ratingDeadline, { message: 'Rating end must be on/after rating start', path: ['ratingDeadline'] });

type ParentValues = z.infer<typeof parentSchema>;
type CycleValues = z.infer<typeof cycleSchema>;

const DateField = ({ form, name, label, description }: { form: any; name: string; label: string; description: string }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn('p-3 pointer-events-auto')} />
          </PopoverContent>
        </Popover>
        <FormDescription className="text-xs">{description}</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ParentSpaceDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { createGoalSpace } = useGoals();
  const form = useForm<ParentValues>({ resolver: zodResolver(parentSchema), defaultValues: { name: '', description: '' } as any });

  const onSubmit = async (values: ParentValues) => {
    try {
      const result = await createGoalSpace({
        name: values.name,
        description: values.description,
        parentId: null,
        spaceKind: 'parent',
        startDate: values.startDate.toISOString(),
        submissionDeadline: values.submissionDeadline.toISOString(),
        reviewDeadline: values.reviewDeadline.toISOString(),
      } as any);
      if (result) {
        toast({ title: 'Goal Space Created', description: `"${values.name}" and its Goal Setting sub-space are ready.` });
        form.reset();
        onOpenChange(false);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not create goal space', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Create Goal Space</DialogTitle>
          <DialogDescription>
            A Goal Space (e.g., "2027 Goals") automatically gets a Goal Setting sub-space where all goals are authored and approved.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="2027 Goals" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (optional)</FormLabel><FormControl><Textarea className="resize-none" placeholder="Annual container for 2027 performance cycles" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Goal Setting Timeline</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm">
                These dates apply to the auto-created Goal Setting sub-space where goals are authored and approved.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DateField form={form} name="startDate" label="Start Date" description="When users can start creating goals" />
              <DateField form={form} name="submissionDeadline" label="Submission Deadline" description="Last day to submit goals" />
              <DateField form={form} name="reviewDeadline" label="Review Deadline" description="Last day for manager review" />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CycleDialog = ({ parentId, parentName, open, onOpenChange }: { parentId: string; parentName: string; open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { createGoalSpace } = useGoals();
  const form = useForm<CycleValues>({ resolver: zodResolver(cycleSchema), defaultValues: { name: '', description: '' } as any });

  const onSubmit = async (values: CycleValues) => {
    try {
      const result = await createGoalSpace({
        name: values.name,
        description: values.description,
        parentId,
        spaceKind: 'cycle',
        editStartDate: values.editStartDate.toISOString(),
        editEndDate: values.editEndDate.toISOString(),
        ratingStartDate: values.ratingStartDate.toISOString(),
        ratingDeadline: values.ratingDeadline.toISOString(),
      } as any);
      if (result) {
        toast({ title: 'Sub-Space Created', description: `"${values.name}" added under "${parentName}". Approved goals were copied in.` });
        form.reset();
        onOpenChange(false);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not create sub-space', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Add Sub-Space to "{parentName}"</DialogTitle>
          <DialogDescription>
            Sub-spaces automatically inherit an independent copy of every approved goal from Goal Setting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Q1 2027" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (optional)</FormLabel><FormControl><Textarea className="resize-none" placeholder="First quarter cycle" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Cycle Timeline</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm">
                Order: Edit Start → Edit End → Rating Start → Rating End. Members self-rate first, then managers rate.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField form={form} name="editStartDate" label="Edit Start Date" description="When members can update goal progress" />
              <DateField form={form} name="editEndDate" label="Edit End Date" description="Last day to update progress" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField form={form} name="ratingStartDate" label="Rating Start Date" description="Self- and manager-rating opens" />
              <DateField form={form} name="ratingDeadline" label="Rating Deadline" description="Last day to rate goals" />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
              <Button type="submit">Create Sub-Space</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const formatDate = (d?: string | null) => (d ? format(new Date(d), 'PPP') : '—');

const SubSpaceRow = ({ space, onDelete }: { space: GoalSpace; onDelete: (s: GoalSpace) => void }) => {
  const now = new Date();
  const isGS = space.spaceKind === 'goal_setting';

  let phase: { label: string; className: string } = { label: 'Inactive', className: 'bg-gray-100 text-gray-800' };
  if (space.isActive) {
    if (isGS) {
      const start = space.startDate ? new Date(space.startDate) : null;
      const sub = space.submissionDeadline ? new Date(space.submissionDeadline) : null;
      const rev = space.reviewDeadline ? new Date(space.reviewDeadline) : null;
      if (start && sub && rev) {
        if (now < start) phase = { label: 'Upcoming', className: 'bg-blue-100 text-blue-800' };
        else if (now <= sub) phase = { label: 'Goal Setting', className: 'bg-green-100 text-green-800' };
        else if (now <= rev) phase = { label: 'Review', className: 'bg-amber-100 text-amber-800' };
        else phase = { label: 'Completed', className: 'bg-red-100 text-red-800' };
      }
    } else {
      const es = space.editStartDate ? new Date(space.editStartDate) : null;
      const ee = space.editEndDate ? new Date(space.editEndDate) : null;
      const rs = space.ratingStartDate ? new Date(space.ratingStartDate) : null;
      const rd = space.ratingDeadline ? new Date(space.ratingDeadline) : null;
      if (es && ee && rs && rd) {
        if (now < es) phase = { label: 'Upcoming', className: 'bg-blue-100 text-blue-800' };
        else if (now <= ee) phase = { label: 'Editing', className: 'bg-green-100 text-green-800' };
        else if (now < rs) phase = { label: 'Awaiting Rating', className: 'bg-gray-100 text-gray-800' };
        else if (now <= rd) phase = { label: 'Rating', className: 'bg-purple-100 text-purple-800' };
        else phase = { label: 'Completed', className: 'bg-red-100 text-red-800' };
      }
    }
  }

  return (
    <div className="ml-8 border-l-2 border-muted pl-4 py-3 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {isGS && <Lock className="h-3 w-3 text-muted-foreground" />}
          <span className="font-medium">{space.name}</span>
          <Badge variant="outline" className={phase.className}>{phase.label}</Badge>
          {isGS && <Badge variant="secondary">Auto</Badge>}
        </div>
        {space.description && <p className="text-xs text-muted-foreground mt-1">{space.description}</p>}
        {isGS ? (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div><span className="font-semibold">Start:</span> {formatDate(space.startDate)}</div>
            <div><span className="font-semibold">Submission:</span> {formatDate(space.submissionDeadline)}</div>
            <div><span className="font-semibold">Review:</span> {formatDate(space.reviewDeadline)}</div>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div><span className="font-semibold">Edit Start:</span> {formatDate(space.editStartDate)}</div>
            <div><span className="font-semibold">Edit End:</span> {formatDate(space.editEndDate)}</div>
            <div><span className="font-semibold">Rating Start:</span> {formatDate(space.ratingStartDate)}</div>
            <div><span className="font-semibold">Rating End:</span> {formatDate(space.ratingDeadline)}</div>
          </div>
        )}
      </div>
      {!isGS && (
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(space)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const GoalSpaceManager = () => {
  const [parentDialogOpen, setParentDialogOpen] = useState(false);
  const [subDialogFor, setSubDialogFor] = useState<{ id: string; name: string } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pendingDelete, setPendingDelete] = useState<GoalSpace | null>(null);

  const { deleteGoalSpace, getParentSpaces, getSubSpaces } = useGoals();
  const parents = getParentSpaces();

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteGoalSpace(pendingDelete.id);
      toast({ title: 'Deleted', description: `"${pendingDelete.name}" has been deleted.` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Could not delete', variant: 'destructive' });
    }
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Goal Spaces</h2>
          <p className="text-muted-foreground">Each Goal Space has a mandatory Goal Setting sub-space. Add cycles for ongoing progress and rating.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setParentDialogOpen(true)}>
          <FolderPlus className="h-4 w-4" />
          <span>Create Goal Space</span>
        </Button>
      </div>

      <ParentSpaceDialog open={parentDialogOpen} onOpenChange={setParentDialogOpen} />
      {subDialogFor && (
        <CycleDialog
          parentId={subDialogFor.id}
          parentName={subDialogFor.name}
          open={!!subDialogFor}
          onOpenChange={(o) => !o && setSubDialogFor(null)}
        />
      )}

      {parents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No goal spaces yet. Create your first goal space to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {parents.map(parent => {
            const subs = getSubSpaces(parent.id);
            const cycles = subs.filter(s => s.spaceKind === 'cycle');
            const isOpen = expanded[parent.id] ?? true;
            return (
              <Card key={parent.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-left" onClick={() => toggle(parent.id)}>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Folder className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-semibold">{parent.name}</div>
                        {parent.description && <div className="text-xs text-muted-foreground">{parent.description}</div>}
                      </div>
                      <Badge variant="secondary" className="ml-2">{cycles.length} cycle{cycles.length === 1 ? '' : 's'}</Badge>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" onClick={() => setSubDialogFor({ id: parent.id, name: parent.name })}>
                        <Plus className="h-3 w-3 mr-1" /> Add Sub-Space
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setPendingDelete(parent)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-3">
                      {subs.length === 0 ? (
                        <p className="ml-8 text-sm text-muted-foreground">No sub-spaces yet.</p>
                      ) : (
                        subs.map(s => <SubSpaceRow key={s.id} space={s} onDelete={setPendingDelete} />)
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{pendingDelete?.name}"?</DialogTitle>
            <DialogDescription>
              {pendingDelete && pendingDelete.spaceKind === 'parent'
                ? 'This deletes the Goal Space, its Goal Setting sub-space, all cycles, and every goal inside them.'
                : 'This will delete the cycle sub-space and all cycle-copy goals inside it.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalSpaceManager;

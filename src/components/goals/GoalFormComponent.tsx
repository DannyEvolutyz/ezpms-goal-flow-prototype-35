import { useState } from 'react';
import { format } from 'date-fns';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Milestone, Trash2, Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import GoalBankComponent from './GoalBankComponent';
import MilestonesArrayField from './MilestonesArrayField';

const milestoneSchema = z.object({
  title: z.string().min(2, { message: 'Milestone title must be at least 2 characters' }),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
  targetDate: z.date({ required_error: "Please select a target date for each milestone" }).optional(),
});
const goalFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  category: z.enum(['Professional Development', 'Technical Skills', 'Leadership', 'Innovation'], {
    required_error: 'Please select a category',
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: 'Please select a priority',
  }),
  targetDate: z.date({
    required_error: 'Please select a target date',
  }).refine((date) => date > new Date(), {
    message: 'Target date must be in the future',
  }),
  milestones: z.array(milestoneSchema).max(10, { message: 'No more than 10 milestones' }).optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const GoalFormComponent = () => {
  const { addGoal } = useGoals();
  const [formKey, setFormKey] = useState(0);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      priority: undefined,
      targetDate: undefined,
      milestones: [],
    },
  });

  const milestoneFieldArray = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const applyTemplate = (template: { title: string; description: string; category: string }) => {
    form.setValue('title', template.title);
    form.setValue('description', template.description);
    form.setValue('category', template.category as any);
  };

  const onSubmit = (data: GoalFormValues) => {
    const withMilestones =
      data.milestones &&
      Array.isArray(data.milestones) &&
      data.milestones.length > 0 &&
      data.milestones.some(m => m.title && m.title.trim().length > 0);

    const milestones = withMilestones
      ? data.milestones.map((m, i) => ({
          id: `ms-${Date.now()}-${i}`,
          title: m.title,
          description: m.description,
          completed: !!m.completed,
          targetDate: m.targetDate ? (m.targetDate instanceof Date
            ? m.targetDate.toISOString().split('T')[0]
            : m.targetDate // already string
            ) : undefined,
        }))
      : [];

    addGoal({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      milestones,
    });

    form.reset();
    setFormKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <GoalBankComponent onSelectTemplate={applyTemplate} />
      <Card key={formKey}>
        <CardHeader>
          <CardTitle className="text-lg">Goal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter goal title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your goal in detail"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Professional Development">
                            Professional Development
                          </SelectItem>
                          <SelectItem value="Technical Skills">
                            Technical Skills
                          </SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                          <SelectItem value="Innovation">Innovation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Completion Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                          className={cn('p-3 pointer-events-auto')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <MilestonesArrayField form={form} fieldArray={milestoneFieldArray} />
              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalFormComponent;

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

const milestoneSchema = z.object({
  title: z.string().min(2, { message: 'Milestone title must be at least 2 characters' }),
  description: z.string().optional(),
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

  const { fields: milestoneFields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const applyTemplate = (template: { title: string; description: string; category: string }) => {
    form.setValue('title', template.title);
    form.setValue('description', template.description);
    form.setValue('category', template.category as any);
  };

  const onSubmit = (data: GoalFormValues) => {
    addGoal({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      milestones: data.milestones && data.milestones.length > 0 
        ? data.milestones.map((m, i) => ({
            id: `ms-${Date.now()}-${i}`,
            title: m.title,
            description: m.description,
          }))
        : undefined,
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
                          <SelectItem value="Professional Development">Professional Development</SelectItem>
                          <SelectItem value="Technical Skills">Technical Skills</SelectItem>
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
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Milestone className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-blue-700">Milestones <span className="text-gray-500 font-normal">(optional)</span></span>
                </div>
                {milestoneFields.length === 0 ? (
                  <p className="text-xs text-muted-foreground mb-2 ml-[30px]">Break down your goal into steps for better tracking.</p>
                ) : null}
                <div className="space-y-2">
                  {milestoneFields.map((field, index) => (
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
                    disabled={milestoneFields.length >= 10}
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
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalFormComponent;

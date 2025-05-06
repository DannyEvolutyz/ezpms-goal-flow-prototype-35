import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useGoals } from '@/contexts/GoalContext';
import { Goal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ArrowLeft, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";

// Goal form schema with validation
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
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalEditFormProps {
  goal: Goal;
  onCancel: () => void;
}

const GoalEditForm = ({ goal, onCancel }: GoalEditFormProps) => {
  const { updateGoal, isSpaceReadOnly } = useGoals();
  const isReadOnly = isSpaceReadOnly(goal.spaceId);
  
  // Initialize the form with goal data
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: goal.title,
      description: goal.description,
      category: goal.category as any,
      priority: goal.priority,
      targetDate: new Date(goal.targetDate),
    },
  });

  // Handle form submission
  const onSubmit = (data: GoalFormValues) => {
    if (isReadOnly) {
      toast({
        title: "Cannot update goal",
        description: "This goal belongs to a read-only space.",
        variant: "destructive"
      });
      return;
    }
    
    updateGoal({
      ...goal,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      // Keep the status unchanged
    });
    
    onCancel(); // Return to the list view
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-blue-600">Edit Goal</h2>
      </div>
      
      {isReadOnly && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Read-only Goal</AlertTitle>
          <AlertDescription className="text-amber-700">
            This goal belongs to a space that is now read-only. You can view the details but cannot make changes.
          </AlertDescription>
        </Alert>
      )}
      
      {goal.feedback && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">Manager Feedback</AlertTitle>
          <AlertDescription className="text-blue-700">
            {goal.feedback}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
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
                      <Input placeholder="Enter goal title" {...field} disabled={isReadOnly} />
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
                        disabled={isReadOnly}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalEditForm;

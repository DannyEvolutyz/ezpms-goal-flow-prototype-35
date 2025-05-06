
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FolderPlus, Trash2 } from 'lucide-react';
import { useGoals } from '@/contexts/goal';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { GoalSpace } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const goalSpaceSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  description: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  submissionDeadline: z.date({ required_error: "Submission deadline is required" }),
  reviewDeadline: z.date({ required_error: "Review deadline is required" })
}).refine(data => {
  return data.startDate <= data.submissionDeadline;
}, {
  message: "Submission deadline must be after or equal to start date",
  path: ["submissionDeadline"]
}).refine(data => {
  return data.submissionDeadline <= data.reviewDeadline;
}, {
  message: "Review deadline must be after or equal to submission deadline",
  path: ["reviewDeadline"]
});

type GoalSpaceFormValues = z.infer<typeof goalSpaceSchema>;

const GoalSpaceManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createGoalSpace, deleteGoalSpace, getAllSpaces } = useGoals();

  const spaces = getAllSpaces();
  
  const form = useForm<GoalSpaceFormValues>({
    resolver: zodResolver(goalSpaceSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  const onSubmit = (values: GoalSpaceFormValues) => {
    try {
      const result = createGoalSpace({
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        submissionDeadline: values.submissionDeadline.toISOString(),
        reviewDeadline: values.reviewDeadline.toISOString()
      });

      if (result) {
        toast({
          title: "Goal Space Created",
          description: `The goal space "${values.name}" has been created successfully.`,
          variant: "default",
        });
        form.reset();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "You don't have permission to create a goal space.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the goal space.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteSpace = (spaceId: string, spaceName: string) => {
    try {
      deleteGoalSpace(spaceId);
      toast({
        title: "Goal Space Deleted",
        description: `The goal space "${spaceName}" has been deleted.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the goal space.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Goal Spaces</h2>
          <p className="text-muted-foreground">
            Create and manage goal spaces for performance review cycles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              <span>Create Goal Space</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Goal Space</DialogTitle>
              <DialogDescription>
                Create a new goal space for employees to set and track their goals.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Q1 2025 Performance Goals" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this goal cycle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Goals for the first quarter of 2025" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="submissionDeadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Submission Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reviewDeadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Review Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create Goal Space</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {spaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No goal spaces found. Create your first goal space to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Submission Deadline</TableHead>
                <TableHead>Review Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.map((space: GoalSpace) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium">
                    {space.name}
                    {space.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{space.description}</p>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(space.startDate)}</TableCell>
                  <TableCell>{formatDate(space.submissionDeadline)}</TableCell>
                  <TableCell>{formatDate(space.reviewDeadline)}</TableCell>
                  <TableCell>
                    {space.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Goal Space</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the goal space "{space.name}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-4">
                          <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDeleteSpace(space.id, space.name)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GoalSpaceManager;

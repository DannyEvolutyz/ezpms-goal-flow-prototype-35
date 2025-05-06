
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGoals } from '@/contexts/goal';
import { toast } from '@/hooks/use-toast';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const goalTemplateSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  category: z.string().min(1, { message: "Please select a category" }),
  spaceId: z.string().min(1, { message: "Please select a space" })
});

type GoalTemplateFormValues = z.infer<typeof goalTemplateSchema>;

const SpaceGoalTemplateForm = () => {
  const { addGoalTemplate, getAllSpaces } = useGoals();
  const spaces = getAllSpaces();
  
  const form = useForm<GoalTemplateFormValues>({
    resolver: zodResolver(goalTemplateSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      spaceId: spaces.length > 0 ? spaces[0].id : ''
    },
  });

  const onSubmit = (values: GoalTemplateFormValues) => {
    try {
      addGoalTemplate({
        title: values.title,
        description: values.description,
        category: values.category,
      });

      toast({
        title: "Template Goal Created",
        description: `"${values.title}" has been added to the goal bank.`,
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the template goal.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const categories = [
    "Technical Skills",
    "Leadership",
    "Communication",
    "Personal Growth",
    "Project Goals",
    "Innovation"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Template Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Improve technical skills in React" {...field} />
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
                      placeholder="Deepen knowledge of React hooks, context API, and performance optimization techniques."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Space</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal space" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {spaces.length === 0 ? (
                        <SelectItem value="none" disabled>No available goal spaces</SelectItem>
                      ) : (
                        spaces.map((space) => (
                          <SelectItem key={space.id} value={space.id}>
                            {space.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Create Template Goal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SpaceGoalTemplateForm;


import * as z from 'zod';

export const milestoneSchema = z.object({
  title: z.string().min(2, { message: 'Milestone title must be at least 2 characters' }),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
  targetDate: z.date({ required_error: "Please select a target date for each milestone" }).optional(),
});

export const goalFormSchema = z.object({
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

export type GoalFormValues = z.infer<typeof goalFormSchema>;

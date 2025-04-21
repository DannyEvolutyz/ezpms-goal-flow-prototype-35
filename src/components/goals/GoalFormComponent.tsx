import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import GoalBankComponent from './GoalBankComponent';
import MilestonesArrayField from './MilestonesArrayField';
import GoalTitleField from './GoalTitleField';
import GoalDescriptionField from './GoalDescriptionField';
import GoalCategorySelector from './GoalCategorySelector';
import GoalPrioritySelector from './GoalPrioritySelector';
import GoalTargetDatePicker from './GoalTargetDatePicker';
import { goalFormSchema, GoalFormValues } from './goalFormSchema';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";

const GoalFormComponent = () => {
  const { addGoal, goals } = useGoals();
  const [formKey, setFormKey] = useState(0);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      priority: undefined,
      weightage: 0,
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
    const totalWeightage = goals.reduce((sum, goal) => sum + (goal.weightage || 0), 0) + data.weightage;

    if (totalWeightage > 100) {
      toast({
        title: "Invalid Weightage",
        description: `Total weightage cannot exceed 100. Available: ${100 - goals.reduce((sum, goal) => sum + (goal.weightage || 0), 0)}`,
        variant: "destructive"
      });
      return;
    }

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
          completionComment: m.completionComment,
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
      weightage: data.weightage,
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      milestones,
    });

    form.reset();
    setFormKey(prev => prev + 1);
  };

  const availableWeightage = 100 - goals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);

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
              <GoalTitleField form={form} />
              <GoalDescriptionField form={form} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GoalCategorySelector form={form} />
                <GoalPrioritySelector form={form} />
              </div>
              <div className="form-group">
                <label htmlFor="weightage" className="text-sm font-medium">
                  Weightage (Available: {availableWeightage}%)
                </label>
                <input
                  type="number"
                  {...form.register('weightage', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  min="1"
                  max={availableWeightage}
                />
                {form.formState.errors.weightage && (
                  <p className="text-sm text-red-500">{form.formState.errors.weightage.message}</p>
                )}
              </div>
              <GoalTargetDatePicker form={form} />
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

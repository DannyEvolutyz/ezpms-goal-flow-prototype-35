
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GoalBankComponent from './GoalBankComponent';
import MilestonesArrayField from './MilestonesArrayField';
// Extracted fields and helpers
import GoalTitleField from './GoalTitleField';
import GoalDescriptionField from './GoalDescriptionField';
import GoalCategorySelector from './GoalCategorySelector';
import GoalPrioritySelector from './GoalPrioritySelector';
import GoalTargetDatePicker from './GoalTargetDatePicker';
import { goalFormSchema, GoalFormValues } from './goalFormSchema';
import { format } from 'date-fns';

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <GoalTitleField form={form} />
            <GoalDescriptionField form={form} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GoalCategorySelector form={form} />
              <GoalPrioritySelector form={form} />
            </div>
            <GoalTargetDatePicker form={form} />
            <MilestonesArrayField form={form} fieldArray={milestoneFieldArray} />
            <Button type="submit" className="w-full">
              Create Goal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalFormComponent;


import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoals } from '@/contexts/goal';
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
import GoalSpaceSelector from './GoalSpaceSelector';
import { goalFormSchema, GoalFormValues } from './goalFormSchema';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";

const GoalFormComponent = () => {
  const { addGoal, getAvailableSpaces } = useGoals();
  const [formKey, setFormKey] = useState(0);
  const availableSpaces = getAvailableSpaces();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      priority: undefined,
      targetDate: undefined,
      milestones: [],
      spaceId: availableSpaces.length > 0 ? availableSpaces[0]?.id : '',
    },
  });

  const milestoneFieldArray = useFieldArray({
    control: form.control,
    name: 'milestones',
  });

  const applyTemplate = (template: { title: string; description: string; category: string }) => {
    console.log('GoalFormComponent - Applying template:', template);
    
    // Set form values
    form.setValue('title', template.title);
    form.setValue('description', template.description);
    form.setValue('category', template.category as any);
    
    // Force form to re-render and validate
    form.trigger(['title', 'description', 'category']);
    
    console.log('Template applied successfully');
    
    toast({
      title: "Template Applied",
      description: `Template "${template.title}" has been applied to your goal form.`,
    });
  };

  const onSubmit = (data: GoalFormValues) => {
    console.log('Submitting goal with data:', data);
    
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

    const result = addGoal({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      weightage: 0, // Default weightage, will be set later
      targetDate: format(data.targetDate, 'yyyy-MM-dd'),
      milestones,
      spaceId: data.spaceId,
    });

    if (result) {
      toast({
        title: "Goal Created",
        description: "Your goal has been created successfully. You can set weightage later.",
      });
      form.reset();
      setFormKey(prev => prev + 1);
    }
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
              <GoalSpaceSelector form={form} />
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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalFormComponent;

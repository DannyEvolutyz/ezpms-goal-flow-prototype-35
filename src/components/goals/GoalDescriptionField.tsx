
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface GoalDescriptionFieldProps {
  form: any;
}

const GoalDescriptionField = ({ form }: GoalDescriptionFieldProps) => (
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
);

export default GoalDescriptionField;

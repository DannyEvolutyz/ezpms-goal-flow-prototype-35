
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface GoalTitleFieldProps {
  form: any;
}

const GoalTitleField = ({ form }: GoalTitleFieldProps) => (
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
);

export default GoalTitleField;

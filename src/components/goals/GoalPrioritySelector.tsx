
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalPrioritySelectorProps {
  form: any;
}

const GoalPrioritySelector = ({ form }: GoalPrioritySelectorProps) => (
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
);

export default GoalPrioritySelector;

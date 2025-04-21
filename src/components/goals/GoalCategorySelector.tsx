
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalCategorySelectorProps {
  form: any;
}

const GoalCategorySelector = ({ form }: GoalCategorySelectorProps) => (
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
            <SelectItem value="Professional Development">
              Professional Development
            </SelectItem>
            <SelectItem value="Technical Skills">
              Technical Skills
            </SelectItem>
            <SelectItem value="Leadership">Leadership</SelectItem>
            <SelectItem value="Innovation">Innovation</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default GoalCategorySelector;

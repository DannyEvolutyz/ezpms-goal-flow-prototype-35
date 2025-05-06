
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/contexts/GoalContext';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface GoalSpaceSelectorProps {
  form: any;
}

const GoalSpaceSelector = ({ form }: GoalSpaceSelectorProps) => {
  const { getAvailableSpaces } = useGoals();
  const availableSpaces = getAvailableSpaces();
  
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP');
  };
  
  return (
    <FormField
      control={form.control}
      name="spaceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Goal Space</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a goal space" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableSpaces.length === 0 ? (
                <SelectItem value="none" disabled>No available goal spaces</SelectItem>
              ) : (
                availableSpaces.map(space => (
                  <SelectItem key={space.id} value={space.id}>
                    <div>
                      <div>{space.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Submit by: {formatDate(space.submissionDeadline)}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {availableSpaces.length === 0 && (
            <p className="text-xs text-amber-500 mt-1">
              No goal spaces are currently available. Please contact your administrator.
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GoalSpaceSelector;

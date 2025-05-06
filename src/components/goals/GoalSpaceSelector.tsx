
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/contexts/GoalContext';
import { format } from 'date-fns';
import { Clock, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface GoalSpaceSelectorProps {
  form: any;
}

const GoalSpaceSelector = ({ form }: GoalSpaceSelectorProps) => {
  const { getAvailableSpaces } = useGoals();
  const availableSpaces = getAvailableSpaces();
  
  // Set default value if spaces are available but none selected
  useEffect(() => {
    if (availableSpaces.length > 0 && !form.getValues('spaceId')) {
      form.setValue('spaceId', availableSpaces[0].id);
    }
  }, [availableSpaces, form]);
  
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
            value={field.value || ''}
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
            <div className="flex items-center gap-2 text-amber-500 mt-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs">
                No goal spaces are currently available. Please contact your administrator.
              </p>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GoalSpaceSelector;


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useGoals } from '@/contexts/GoalContext';
import { format } from 'date-fns';
import { Clock, AlertCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';

interface GoalSpaceSelectorProps {
  form: any;
}

const GoalSpaceSelector = ({ form }: GoalSpaceSelectorProps) => {
  const { getAvailableSpaces, getParentSpaces } = useGoals();
  const availableSpaces = getAvailableSpaces();
  const parents = getParentSpaces();

  // Group available sub-spaces by parent
  const grouped = useMemo(() => {
    return parents
      .map(p => ({ parent: p, subs: availableSpaces.filter(s => s.parentId === p.id) }))
      .filter(g => g.subs.length > 0);
  }, [parents, availableSpaces]);

  useEffect(() => {
    if (availableSpaces.length > 0 && !form.getValues('spaceId')) {
      form.setValue('spaceId', availableSpaces[0].id);
    }
  }, [availableSpaces, form]);

  const formatDate = (dateStr?: string | null) => (dateStr ? format(new Date(dateStr), 'PPP') : '—');

  return (
    <FormField
      control={form.control}
      name="spaceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Goal Space</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a goal space" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {grouped.length === 0 ? (
                <SelectItem value="none" disabled>No available goal spaces</SelectItem>
              ) : (
                grouped.map(g => (
                  <SelectGroup key={g.parent.id}>
                    <SelectLabel>{g.parent.name}</SelectLabel>
                    {g.subs.map(space => (
                      <SelectItem key={space.id} value={space.id}>
                        <div>
                          <div>{space.name}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Submit by: {formatDate(space.submissionDeadline)}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              )}
            </SelectContent>
          </Select>
          {availableSpaces.length === 0 && (
            <div className="flex items-center gap-2 text-amber-500 mt-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs">No goal spaces are currently open for submission. Please contact your administrator.</p>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GoalSpaceSelector;

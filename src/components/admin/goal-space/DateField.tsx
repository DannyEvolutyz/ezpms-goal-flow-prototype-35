import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateFieldProps {
  form: any;
  name: string;
  label: string;
  description: string;
}

const DateField = ({ form, name, label, description }: DateFieldProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn('p-3 pointer-events-auto')} />
          </PopoverContent>
        </Popover>
        <FormDescription className="text-xs">{description}</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default DateField;

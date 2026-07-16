
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useGoals } from '@/contexts/goal';
import { format } from 'date-fns';
import { Clock, Building } from 'lucide-react';
import { useMemo } from 'react';

interface ManagerGoalSpaceSelectorProps {
  selectedSpaceId: string;
  onSpaceChange: (spaceId: string) => void;
}

const ManagerGoalSpaceSelector = ({ selectedSpaceId, onSpaceChange }: ManagerGoalSpaceSelectorProps) => {
  const { getAllSpaces, getParentSpaces } = useGoals();
  const allSpaces = getAllSpaces();
  const parents = getParentSpaces();

  const grouped = useMemo(() => {
    return parents
      .map(p => ({ parent: p, subs: allSpaces.filter(s => s.parentId === p.id) }))
      .filter(g => g.subs.length > 0);
  }, [parents, allSpaces]);

  const formatDate = (dateStr?: string | null) => (dateStr ? format(new Date(dateStr), 'PPP') : '—');

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Select Goal Space</h3>
      </div>
      <Select value={selectedSpaceId} onValueChange={onSpaceChange}>
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Choose a goal space to view team goals" />
        </SelectTrigger>
        <SelectContent>
          {grouped.length === 0 ? (
            <SelectItem value="none" disabled>No goal spaces available</SelectItem>
          ) : (
            grouped.map(g => (
              <SelectGroup key={g.parent.id}>
                <SelectLabel>{g.parent.name}</SelectLabel>
                {g.subs.map(space => (
                  <SelectItem key={space.id} value={space.id}>
                    <div>
                      <div className="font-medium">{space.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Review by: {formatDate(space.reviewDeadline)}</span>
                        {!space.isActive && <span className="ml-2 text-amber-500">(Inactive)</span>}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManagerGoalSpaceSelector;

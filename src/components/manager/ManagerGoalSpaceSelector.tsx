
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/contexts/goal';
import { format } from 'date-fns';
import { Clock, Building } from 'lucide-react';

interface ManagerGoalSpaceSelectorProps {
  selectedSpaceId: string;
  onSpaceChange: (spaceId: string) => void;
}

const ManagerGoalSpaceSelector = ({ selectedSpaceId, onSpaceChange }: ManagerGoalSpaceSelectorProps) => {
  const { getAllSpaces } = useGoals();
  const allSpaces = getAllSpaces();
  
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP');
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Select Goal Space</h3>
      </div>
      <Select
        value={selectedSpaceId}
        onValueChange={onSpaceChange}
      >
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Choose a goal space to view team goals" />
        </SelectTrigger>
        <SelectContent>
          {allSpaces.length === 0 ? (
            <SelectItem value="none" disabled>No goal spaces available</SelectItem>
          ) : (
            allSpaces.map(space => (
              <SelectItem key={space.id} value={space.id}>
                <div>
                  <div className="font-medium">{space.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Review by: {formatDate(space.reviewDeadline)}</span>
                    {!space.isActive && (
                      <span className="ml-2 text-amber-500">(Inactive)</span>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManagerGoalSpaceSelector;

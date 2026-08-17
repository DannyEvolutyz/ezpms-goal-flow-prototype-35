
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/contexts/goal';
import { format } from 'date-fns';
import { Clock, Building, ChevronRight, ArrowLeft, Layers } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ManagerGoalSpaceSelectorProps {
  selectedSpaceId: string;
  onSpaceChange: (spaceId: string) => void;
}

const ManagerGoalSpaceSelector = ({ selectedSpaceId, onSpaceChange }: ManagerGoalSpaceSelectorProps) => {
  const { getAllSpaces, getParentSpaces } = useGoals();
  const allSpaces = getAllSpaces();
  const parents = getParentSpaces();

  const [selectedParentId, setSelectedParentId] = useState('');

  // Keep the parent in sync when a sub-space is already selected
  useEffect(() => {
    if (selectedSpaceId && !selectedParentId) {
      const space = allSpaces.find(s => s.id === selectedSpaceId);
      if (space?.parentId) setSelectedParentId(space.parentId);
    }
  }, [selectedSpaceId, selectedParentId, allSpaces]);

  const subSpaces = useMemo(
    () => allSpaces.filter(s => s.parentId === selectedParentId),
    [allSpaces, selectedParentId]
  );

  const selectedParent = parents.find(p => p.id === selectedParentId);
  const selectedSpace = allSpaces.find(s => s.id === selectedSpaceId);

  const formatDate = (dateStr?: string | null) => (dateStr ? format(new Date(dateStr), 'PPP') : '—');

  const handleParentChange = (parentId: string) => {
    setSelectedParentId(parentId);
    onSpaceChange('');
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Select Goal Space</h3>
      </div>

      <Select value={selectedParentId} onValueChange={handleParentChange}>
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Choose a goal space" />
        </SelectTrigger>
        <SelectContent>
          {parents.length === 0 ? (
            <SelectItem value="none" disabled>No goal spaces available</SelectItem>
          ) : (
            parents.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div>
                  <div className="font-medium">{p.name}</div>
                  {!p.isActive && <span className="text-xs text-amber-500">(Inactive)</span>}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedParent && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{selectedParent.name}</span>
          {selectedSpace && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{selectedSpace.name}</span>
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => onSpaceChange('')}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to blocks
              </Button>
            </>
          )}
        </div>
      )}

      {selectedParent && !selectedSpaceId && (
        subSpaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">No blocks have been created inside this goal space yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subSpaces.map(space => (
              <Card
                key={space.id}
                className="cursor-pointer transition-colors hover:border-primary"
                onClick={() => onSpaceChange(space.id)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span className="font-medium">{space.name}</span>
                    </div>
                    {space.spaceKind === 'goal_setting' && <Badge variant="secondary">Goal Setting</Badge>}
                    {!space.isActive && <Badge variant="outline" className="text-amber-500">Inactive</Badge>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {space.spaceKind === 'goal_setting'
                        ? `Review by: ${formatDate(space.reviewDeadline)}`
                        : `Rating: ${formatDate(space.ratingStartDate)} – ${formatDate(space.ratingDeadline)}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ManagerGoalSpaceSelector;

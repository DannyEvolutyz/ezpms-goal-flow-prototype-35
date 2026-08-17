
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals } from '@/contexts/goal';
import { format } from 'date-fns';
import { Clock, Building, ChevronRight, Layers } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

  // Back-fill the parent only when a space is selected but no parent is known
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

  const clearAll = () => {
    setSelectedParentId('');
    onSpaceChange('');
  };

  const clearBlock = () => onSpaceChange('');

  const selectParent = (parentId: string) => {
    setSelectedParentId(parentId);
    onSpaceChange('');
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Select Goal Space</h3>
      </div>

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 text-sm">
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          All Goal Spaces
        </button>
        {selectedParent && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              type="button"
              onClick={clearBlock}
              className={selectedSpace
                ? 'text-muted-foreground hover:text-foreground hover:underline'
                : 'font-medium text-foreground'}
            >
              {selectedParent.name}
            </button>
          </>
        )}
        {selectedSpace && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{selectedSpace.name}</span>
          </>
        )}
      </div>

      <Select value={selectedParentId} onValueChange={selectParent}>
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

      {/* Parent cards when nothing is selected */}
      {!selectedParentId && parents.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parents.map(p => (
            <Card
              key={p.id}
              className="cursor-pointer transition-colors hover:border-primary"
              onClick={() => selectParent(p.id)}
            >
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span className="font-medium">{p.name}</span>
                </div>
                {!p.isActive && <Badge variant="outline" className="text-amber-500">Inactive</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blocks inside the selected parent */}
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

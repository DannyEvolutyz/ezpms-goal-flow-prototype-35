
import { useState, useEffect, useMemo } from 'react';
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import GoalFormComponent from '@/components/goals/GoalFormComponent';
import GoalsListComponent from '@/components/goals/GoalsListComponent';
import GoalEditForm from '@/components/goals/GoalEditForm';
import GoalBankComponent from '@/components/goals/GoalBankComponent';
import { CalendarDays } from 'lucide-react';

const Goals = () => {
  const {
    goals, spaces, getGoalsBySpace, getParentSpaces, getSubSpaces,
    getGoalSettingSpaceForParent, getParentSpacesOpenForCreation, isSpaceReadOnly,
  } = useGoals();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [editingGoal, setEditingGoal] = useState(null);

  const parentSpaces = getParentSpaces();
  const openParents = getParentSpacesOpenForCreation();
  const [selectedParentId, setSelectedParentId] = useState<string>(parentSpaces[0]?.id || '');
  const subSpaces = useMemo(
    () => (selectedParentId ? getSubSpaces(selectedParentId) : []),
    [selectedParentId, spaces] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [selectedSubSpaceId, setSelectedSubSpaceId] = useState<string>('');

  // Keep default parent
  useEffect(() => {
    if (!selectedParentId && parentSpaces.length > 0) {
      setSelectedParentId(parentSpaces[0].id);
    }
  }, [parentSpaces, selectedParentId]);

  // Default sub-space = Goal Setting when parent changes
  useEffect(() => {
    if (subSpaces.length === 0) {
      setSelectedSubSpaceId('');
      return;
    }
    const stillValid = subSpaces.some(s => s.id === selectedSubSpaceId);
    if (!stillValid) {
      const gs = subSpaces.find(s => s.spaceKind === 'goal_setting');
      setSelectedSubSpaceId((gs || subSpaces[0]).id);
    }
  }, [subSpaces, selectedSubSpaceId]);

  if (editingGoal) {
    return <GoalEditForm goal={editingGoal} onCancel={() => setEditingGoal(null)} />;
  }

  const handleCreateNew = () => setActiveTab('create');
  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) setEditingGoal(goal);
  };

  const isReadOnly = selectedSubSpaceId ? isSpaceReadOnly(selectedSubSpaceId) : true;
  const filteredGoals = selectedSubSpaceId ? getGoalsBySpace(selectedSubSpaceId) : [];

  const getSpaceDeadlineStatus = (spaceId: string) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space) return null;
    const now = new Date();

    if (space.spaceKind === 'goal_setting') {
      if (!space.submissionDeadline || !space.reviewDeadline) return null;
      const submissionDeadline = new Date(space.submissionDeadline);
      const reviewDeadline = new Date(space.reviewDeadline);
      if (now > reviewDeadline) return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
      if (now > submissionDeadline) return { status: 'review-only', label: 'Review Only', color: 'bg-amber-100 text-amber-800' };
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    }

    if (space.spaceKind === 'cycle') {
      if (!space.editStartDate || !space.editEndDate || !space.ratingStartDate || !space.ratingDeadline) return null;
      const es = new Date(space.editStartDate), ee = new Date(space.editEndDate);
      const rs = new Date(space.ratingStartDate), rd = new Date(space.ratingDeadline);
      if (now < es) return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
      if (now <= ee) return { status: 'editing', label: 'Editing Open', color: 'bg-green-100 text-green-800' };
      if (now < rs) return { status: 'waiting', label: 'Awaiting Rating', color: 'bg-amber-100 text-amber-800' };
      if (now <= rd) return { status: 'rating', label: 'Rating Open', color: 'bg-purple-100 text-purple-800' };
      return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
    return null;
  };

  const selectedSubSpace = spaces.find(s => s.id === selectedSubSpaceId);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Performance Goals</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">My Goals</TabsTrigger>
          <TabsTrigger value="create" disabled={openParents.length === 0}>Create New Goal</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CalendarDays className="mr-2 h-5 w-5" />
                Select Goal Space
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a goal space" />
                </SelectTrigger>
                <SelectContent>
                  {parentSpaces.length === 0 ? (
                    <SelectItem value="none" disabled>No goal spaces available</SelectItem>
                  ) : (
                    parentSpaces.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {subSpaces.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {subSpaces.map(s => {
                    const status = getSpaceDeadlineStatus(s.id);
                    const active = s.id === selectedSubSpaceId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubSpaceId(s.id)}
                        className={`px-3 py-2 rounded-md border text-sm transition-colors flex items-center gap-2 ${
                          active
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span>{s.spaceKind === 'goal_setting' ? 'Goal Setting' : s.name}</span>
                        {status && <Badge className={status.color}>{status.label}</Badge>}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSubSpace && (
                <div className="text-sm">
                  {isReadOnly ? (
                    <p className="text-amber-600">
                      This space is read-only. You cannot create or edit goals in it right now.
                    </p>
                  ) : (
                    (() => {
                      const until = selectedSubSpace.spaceKind === 'cycle'
                        ? selectedSubSpace.editEndDate
                        : selectedSubSpace.submissionDeadline;
                      return (
                        <p className="text-green-600">
                          You can create and edit goals in this space until{' '}
                          {until && format(new Date(until), 'MMMM d, yyyy')}
                        </p>
                      );
                    })()
                  )}
                </div>
              )}

              {parentSpaces.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No goal spaces have been created yet. Please contact your administrator.
                </p>
              )}
            </CardContent>
          </Card>

          {selectedSubSpaceId ? (
            <>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <GoalBankComponent
                    spaceId={selectedParentId}
                    onSelectTemplate={() => setActiveTab('create')}
                  />
                </CardContent>
              </Card>

              <GoalsListComponent
                onCreateNew={handleCreateNew}
                onEditGoal={handleEditGoal}
                goals={filteredGoals}
                spaceId={selectedSubSpaceId}
                isReadOnly={isReadOnly}
              />
            </>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Please select a goal space to view your goals.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <GoalFormComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;

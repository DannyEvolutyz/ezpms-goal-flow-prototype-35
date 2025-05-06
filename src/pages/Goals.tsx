
import { useState, useEffect } from 'react';
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
import { CalendarDays } from 'lucide-react';

const Goals = () => {
  const { goals, spaces, getGoalsBySpace, getAllSpaces, getActiveSpace, isSpaceReadOnly } = useGoals();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [editingGoal, setEditingGoal] = useState(null);
  const allSpaces = getAllSpaces();
  const activeSpace = getActiveSpace();
  const [selectedSpaceId, setSelectedSpaceId] = useState(activeSpace?.id || '');
  
  // Update selected space if active space changes
  useEffect(() => {
    if (activeSpace && !selectedSpaceId) {
      setSelectedSpaceId(activeSpace.id);
    }
  }, [activeSpace, selectedSpaceId]);
  
  if (editingGoal) {
    return <GoalEditForm goal={editingGoal} onCancel={() => setEditingGoal(null)} />;
  }
  
  const handleCreateNew = () => {
    setActiveTab('create');
  };

  const isReadOnly = selectedSpaceId ? isSpaceReadOnly(selectedSpaceId) : true;
  const filteredGoals = selectedSpaceId ? getGoalsBySpace(selectedSpaceId) : [];
  
  const getSpaceDeadlineStatus = (spaceId) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space) return null;
    
    const now = new Date();
    const submissionDeadline = new Date(space.submissionDeadline);
    const reviewDeadline = new Date(space.reviewDeadline);
    
    if (now > reviewDeadline) {
      return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    } else if (now > submissionDeadline) {
      return { status: 'review-only', label: 'Review Only', color: 'bg-amber-100 text-amber-800' };
    } else {
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Performance Goals</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">My Goals</TabsTrigger>
          <TabsTrigger value="create" disabled={user?.role === 'manager' || !activeSpace}>Create New Goal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CalendarDays className="mr-2 h-5 w-5" />
                Select Goal Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSpaceId}
                onValueChange={setSelectedSpaceId}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a goal space" />
                </SelectTrigger>
                <SelectContent>
                  {allSpaces.length === 0 ? (
                    <SelectItem value="none" disabled>No goal spaces available</SelectItem>
                  ) : (
                    allSpaces.map(space => {
                      const status = getSpaceDeadlineStatus(space.id);
                      return (
                        <SelectItem key={space.id} value={space.id} className="flex justify-between items-center">
                          <div className="flex items-center justify-between w-full pr-2">
                            <span>{space.name}</span>
                            <Badge className={status?.color}>{status?.label}</Badge>
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              
              {selectedSpaceId && (
                <div className="mt-2 text-sm">
                  {isReadOnly ? (
                    <p className="text-amber-600">
                      This space is read-only. You cannot create or edit goals in it anymore.
                    </p>
                  ) : (
                    <p className="text-green-600">
                      You can create and edit goals in this space until{" "}
                      {spaces.find(s => s.id === selectedSpaceId)?.submissionDeadline && 
                       format(new Date(spaces.find(s => s.id === selectedSpaceId).submissionDeadline), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
              )}
              
              {allSpaces.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No goal spaces have been created yet. Please contact your administrator.
                </p>
              )}
            </CardContent>
          </Card>
          
          {selectedSpaceId ? (
            <GoalsListComponent
              onCreateNew={handleCreateNew}
              goals={filteredGoals}
              spaceId={selectedSpaceId}
              isReadOnly={isReadOnly}
            />
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

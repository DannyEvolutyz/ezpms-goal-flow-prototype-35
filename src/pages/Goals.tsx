import { useState } from 'react';
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalFormComponent from '@/components/goals/GoalFormComponent';
import GoalsListComponent from '@/components/goals/GoalsListComponent';
import GoalEditForm from '@/components/goals/GoalEditForm';

const Goals = () => {
  const { goals } = useGoals();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [editingGoal, setEditingGoal] = useState(null);
  
  if (editingGoal) {
    return <GoalEditForm goal={editingGoal} onCancel={() => setEditingGoal(null)} />;
  }
  
  const handleCreateNew = () => {
    setActiveTab('create');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Performance Goals</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">My Goals</TabsTrigger>
          <TabsTrigger value="create" disabled={user?.role === 'manager'}>Create New Goal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <GoalsListComponent onCreateNew={handleCreateNew} />
        </TabsContent>
        
        <TabsContent value="create">
          <GoalFormComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;

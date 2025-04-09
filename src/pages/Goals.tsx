
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalFormComponent from '@/components/goals/GoalFormComponent';
import GoalsListComponent from '@/components/goals/GoalsListComponent';
import { Plus, List } from 'lucide-react';

const Goals = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Goal Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>My Goals</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Goal</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <GoalsListComponent />
        </TabsContent>
        
        <TabsContent value="create" className="mt-0">
          <GoalFormComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;

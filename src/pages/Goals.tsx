
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalFormComponent from '@/components/goals/GoalFormComponent';
import GoalsListComponent from '@/components/goals/GoalsListComponent';
import { Plus, List } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Goals = () => {
  const location = useLocation();
  // Check if we need to show the create tab based on URL search params
  const showCreateTab = location.search === '?create=true';
  const [activeTab, setActiveTab] = useState(showCreateTab ? 'create' : 'list');
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Goal Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>My Goals</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2" disabled={isManager}>
            <Plus className="h-4 w-4" />
            <span>Create Goal</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <GoalsListComponent onCreateNew={() => setActiveTab('create')} />
        </TabsContent>
        
        <TabsContent value="create" className="mt-0">
          {!isManager ? (
            <GoalFormComponent />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Managers Cannot Create Goals</h3>
              <p className="text-amber-700">
                As a manager, you are responsible for reviewing and providing feedback on your team members' goals.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;

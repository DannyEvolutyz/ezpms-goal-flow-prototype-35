
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsOverview from '@/components/dashboard/StatsOverview';
import OrgChart from '@/components/organization/OrgChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { getTeamGoals, getPendingReviewGoals } = useGoals();
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }
  
  const teamGoals = getTeamGoals();
  const pendingGoals = getPendingReviewGoals();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeBanner needsAttentionCount={pendingGoals.length} />
      
      <StatsOverview />
      
      <Tabs defaultValue="org" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="org" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Organization</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Team Goals</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="org">
          <OrgChart />
        </TabsContent>
        
        <TabsContent value="goals">
          <h2 className="text-xl font-semibold mb-4">Team Goals Overview</h2>
          <p className="text-gray-600 mb-4">
            As an administrator, you can view and manage all goals across the organization.
          </p>
          
          {/* This would be expanded with actual goal management components */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              Goal management features for admins will be implemented here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600 mb-4">
            Configure system-wide settings and preferences.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              System settings will be implemented here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

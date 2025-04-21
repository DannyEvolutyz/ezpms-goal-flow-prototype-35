
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, UserCog, ListCheck } from 'lucide-react';
import GoalBankManager from '@/components/admin/GoalBankManager';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="goalbank" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="goalbank" className="flex items-center gap-2">
            <ListCheck className="h-4 w-4" />
            <span>Goal Bank</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="goalbank">
          <GoalBankManager />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserCog className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                User management features are coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                System settings dashboard is coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

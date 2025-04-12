
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Users, 
  UserRound, 
  Shield, 
  ChevronRight,
  UserCheck,
  UserCog
} from 'lucide-react';

const OrgChart = () => {
  const { user, getAllUsers, updateUserManager } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newManagerId, setNewManagerId] = useState<string>('');
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="text-center p-8">
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }
  
  const allUsers = getAllUsers();
  
  // Filter users based on the current user's role
  const managingUsers = user.role === 'admin' 
    ? allUsers
    : allUsers.filter(u => u.managerId === user.id);
  
  // Get potential managers - exclude the selected user and their subordinates
  const getPotentialManagers = (selectedUser: User) => {
    // Find all users that report to the selected user (directly or indirectly)
    const findAllSubordinates = (userId: string): string[] => {
      const directReports = allUsers.filter(u => u.managerId === userId).map(u => u.id);
      const allReports = [...directReports];
      
      directReports.forEach(reportId => {
        allReports.push(...findAllSubordinates(reportId));
      });
      
      return allReports;
    };
    
    const excludeIds = [selectedUser.id, ...findAllSubordinates(selectedUser.id)];
    
    // Filter potential managers based on user role
    if (user.role === 'admin') {
      // Admins can assign anyone to anyone except themselves
      return allUsers.filter(u => !excludeIds.includes(u.id) && u.role !== 'member');
    } else {
      // Managers can only assign to themselves
      return allUsers.filter(u => u.id === user.id);
    }
  };
  
  const handleUserSelect = (userId: string) => {
    const selected = allUsers.find(u => u.id === userId) || null;
    setSelectedUser(selected);
    setNewManagerId('');
  };
  
  const handleUpdateManager = () => {
    if (!selectedUser || !newManagerId) {
      toast.error('Please select both a user and a new manager');
      return;
    }
    
    updateUserManager(selectedUser.id, newManagerId);
    toast.success(`Updated ${selectedUser.name}'s manager successfully`);
    
    // Reset selection
    setSelectedUser(null);
    setNewManagerId('');
  };
  
  const getUserIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'manager':
        return <UserCog className="h-5 w-5 text-blue-500" />;
      default:
        return <UserRound className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getCurrentManager = (userId: string) => {
    const managerId = allUsers.find(u => u.id === userId)?.managerId;
    if (!managerId) return 'None';
    return allUsers.find(u => u.id === managerId)?.name || 'Unknown';
  };
  
  // Hierarchical view of the organization
  const renderOrgHierarchy = () => {
    // Get top-level users (admins or those with no manager)
    const topLevelUsers = allUsers.filter(u => 
      u.role === 'admin' || !u.managerId
    );
    
    const renderUserWithSubordinates = (user: User, level = 0) => {
      const subordinates = allUsers.filter(u => u.managerId === user.id);
      
      return (
        <div key={user.id} className="mt-1">
          <div 
            className={`flex items-center p-2 rounded-md ${level === 0 ? 'bg-slate-100' : ''}`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            {getUserIcon(user.role)}
            <span className="ml-2 font-medium">{user.name}</span>
            <span className="ml-2 text-sm text-gray-500">({user.role})</span>
          </div>
          
          {subordinates.map(sub => renderUserWithSubordinates(sub, level + 1))}
        </div>
      );
    };
    
    return (
      <div className="mt-4 border rounded-md p-3">
        <h3 className="font-medium mb-2 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Organizational Hierarchy
        </h3>
        {topLevelUsers.map(user => renderUserWithSubordinates(user))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Organization Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Management Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Manage Team
            </CardTitle>
            <CardDescription>
              Update reporting relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Select User</label>
                <Select 
                  value={selectedUser?.id} 
                  onValueChange={handleUserSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {managingUsers
                      .filter(u => u.id !== user.id) // Don't include current user
                      .map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          <div className="flex items-center">
                            {getUserIcon(u.role)}
                            <span className="ml-2">{u.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {selectedUser && (
                <>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-medium text-sm mb-1">Current Details</h3>
                    <p className="text-sm">
                      <span className="font-medium">Manager:</span> {getCurrentManager(selectedUser.id)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Role:</span> {selectedUser.role}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Assign to Manager</label>
                    <Select 
                      value={newManagerId} 
                      onValueChange={setNewManagerId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select new manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPotentialManagers(selectedUser).map(manager => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUpdateManager}
              disabled={!selectedUser || !newManagerId}
              className="w-full"
            >
              Update Manager
            </Button>
          </CardFooter>
        </Card>
        
        {/* Organization Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Organization Chart
            </CardTitle>
            <CardDescription>
              View your organization's structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderOrgHierarchy()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrgChart;

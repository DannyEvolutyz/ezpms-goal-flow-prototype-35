import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, UserCog, ListCheck, FolderPlus, FileCheck, Target } from 'lucide-react';
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoalBankManager from '@/components/admin/GoalBankManager';
import GoalSpaceManager from '@/components/admin/GoalSpaceManager';
import SpaceGoalTemplateForm from '@/components/admin/SpaceGoalTemplateForm';
import PendingGoalsList from '@/components/manager/PendingGoalsList';
import GoalReviewPanel from '@/components/manager/GoalReviewPanel';

const AdminDashboard = () => {
  const { getTeamGoals, approveGoal, rejectGoal, returnGoalForRevision } = useGoals();
  const { user, getAllUsers } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('pending_approval');
  
  // Get all goals in the system (admin can see everything)
  const allGoals = getTeamGoals();
  const allUsers = getAllUsers();
  
  // Filter goals based on selected user and status
  const filteredGoals = allGoals.filter(goal => {
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus;
    const matchesUser = selectedUserId === 'all' || goal.userId === selectedUserId;
    return matchesStatus && matchesUser;
  });
  
  // Get goals that need admin review (pending approval)
  const pendingGoals = allGoals.filter(goal => goal.status === 'pending_approval');
  
  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    setFeedback('');
  };
  
  const handleApprove = () => {
    if (!selectedGoal) return;
    
    approveGoal(selectedGoal.id, feedback);
    toast({
      title: 'Goal Approved',
      description: `You've approved ${selectedGoal.title}`,
      duration: 3000,
    });
    
    setSelectedGoal(null);
    setFeedback('');
  };
  
  const handleReject = () => {
    if (!selectedGoal || !feedback.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please provide feedback before rejecting a goal',
        duration: 3000,
        variant: 'destructive',
      });
      return;
    }
    
    rejectGoal(selectedGoal.id, feedback);
    toast({
      title: 'Goal Rejected',
      description: `You've rejected ${selectedGoal.title}`,
      duration: 3000,
    });
    
    setSelectedGoal(null);
    setFeedback('');
  };
  
  const handleReturnForRevision = () => {
    if (!selectedGoal || !feedback.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please provide feedback before returning a goal for revision',
        duration: 3000,
        variant: 'destructive',
      });
      return;
    }
    
    returnGoalForRevision(selectedGoal.id, feedback);
    toast({
      title: 'Goal Returned for Revision',
      description: `You've requested revisions for ${selectedGoal.title}`,
      duration: 3000,
    });
    
    setSelectedGoal(null);
    setFeedback('');
  };

  const getGoalOwnerName = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'submitted':
        return <Badge className="bg-secondary/20 text-secondary-foreground">Submitted</Badge>;
      case 'under_review':
        return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case 'final_approved':
        return <Badge className="bg-emerald-100 text-emerald-800">Final Approved</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="goalreview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-6 bg-secondary/20 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
          <TabsTrigger value="goalreview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Goal Review</span>
            {pendingGoals.length > 0 && (
              <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingGoals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="goalbank" className="flex items-center gap-2">
            <ListCheck className="h-4 w-4" />
            <span>Goal Bank</span>
          </TabsTrigger>
          <TabsTrigger value="goalspaces" className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            <span>Goal Spaces</span>
          </TabsTrigger>
          <TabsTrigger value="spacegoals" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Space Goals</span>
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
        
        <TabsContent value="goalreview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingGoalsList
              filteredGoals={pendingGoals}
              teamMembers={allUsers}
              selectedUserId={selectedUserId}
              selectedGoal={selectedGoal}
              onUserChange={setSelectedUserId}
              onSelectGoal={handleSelectGoal}
              getGoalOwnerName={getGoalOwnerName}
            />
            
            {selectedGoal && (
              <GoalReviewPanel
                selectedGoal={selectedGoal}
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onApprove={handleApprove}
                onReject={handleReject}
                onReturnForRevision={handleReturnForRevision}
                getGoalOwnerName={getGoalOwnerName}
              />
            )}
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">All Organization Goals</CardTitle>
              <div className="flex gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="final_approved">Final Approved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {allUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredGoals.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No goals found matching the selected filters.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredGoals.map(goal => (
                    <div key={goal.id} className="border rounded-lg p-4 hover:bg-secondary/10 cursor-pointer transition-colors" onClick={() => handleSelectGoal(goal)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-sm text-gray-600">by {getGoalOwnerName(goal.userId)}</p>
                        </div>
                        {getStatusBadge(goal.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        <span>Updated: {new Date(goal.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goalbank">
          <GoalBankManager />
        </TabsContent>
        
        <TabsContent value="goalspaces">
          <GoalSpaceManager />
        </TabsContent>
        
        <TabsContent value="spacegoals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpaceGoalTemplateForm />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Space Goal Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-4 text-center">
                  Goal templates assigned to specific spaces will appear here.
                </p>
                
                <div className="mt-4">
                  <ul className="space-y-2">
                    {/* This section will be expanded in the future to show templates by space */}
                    <li className="text-center text-sm text-gray-400">
                      No space goal templates found
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
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

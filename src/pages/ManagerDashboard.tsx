
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Target, ArrowDown } from 'lucide-react';
import PendingGoalsList from '@/components/manager/PendingGoalsList';
import GoalReviewPanel from '@/components/manager/GoalReviewPanel';

const ManagerDashboard = () => {
  const { getTeamGoals, approveGoal, rejectGoal, returnGoalForRevision } = useGoals();
  const { user, getAllUsers } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('all');
  
  console.log('Manager Dashboard - Current user:', user);
  
  const teamGoals = getTeamGoals();
  console.log('Manager Dashboard - Team goals:', teamGoals);
  
  const allUsers = getAllUsers();
  console.log('Manager Dashboard - All users:', allUsers);
  
  // Get team members for the current manager
  const teamMembers = allUsers.filter(u => u.managerId === user?.id);
  console.log('Manager Dashboard - Team members:', teamMembers);
  
  // Filter goals based on selected user and status - looking for pending_approval goals
  const filteredGoals = teamGoals.filter(goal => {
    console.log('Checking goal:', goal.id, 'status:', goal.status, 'userId:', goal.userId);
    const isPendingApproval = goal.status === 'pending_approval';
    if (selectedUserId === 'all') {
      return isPendingApproval;
    }
    return isPendingApproval && goal.userId === selectedUserId;
  });
  
  console.log('Manager Dashboard - Filtered goals for review:', filteredGoals);
  
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Review Goals</span>
            {filteredGoals.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filteredGoals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Team Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingGoalsList
              filteredGoals={filteredGoals}
              teamMembers={teamMembers}
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
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                Team analytics dashboard is coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                Reports dashboard is coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;

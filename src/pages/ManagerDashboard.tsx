
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Target, ArrowDown, Users } from 'lucide-react';
import PendingGoalsList from '@/components/manager/PendingGoalsList';
import GoalReviewPanel from '@/components/manager/GoalReviewPanel';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManagerDashboard = () => {
  const { getTeamGoals, approveGoal, rejectGoal, returnGoalForRevision } = useGoals();
  const { user, getAllUsers } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('pending_approval');
  
  console.log('Manager Dashboard - Current user:', user);
  
  const teamGoals = getTeamGoals();
  console.log('Manager Dashboard - Team goals:', teamGoals);
  
  const allUsers = getAllUsers();
  console.log('Manager Dashboard - All users:', allUsers);
  
  // Get team members for the current manager
  const teamMembers = allUsers.filter(u => u.managerId === user?.id);
  console.log('Manager Dashboard - Team members:', teamMembers);
  
  // Filter goals based on selected user and status
  const filteredGoals = teamGoals.filter(goal => {
    console.log('Checking goal:', goal.id, 'status:', goal.status, 'userId:', goal.userId);
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus;
    const matchesUser = selectedUserId === 'all' || goal.userId === selectedUserId;
    return matchesStatus && matchesUser;
  });
  
  // Get goals that need review (pending approval)
  const pendingGoals = teamGoals.filter(goal => goal.status === 'pending_approval');
  
  console.log('Manager Dashboard - Filtered goals:', filteredGoals);
  
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
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
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
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Review Goals</span>
            {pendingGoals.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingGoals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all-goals" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>All Team Goals</span>
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
              filteredGoals={pendingGoals}
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

        <TabsContent value="all-goals">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Team Goals</CardTitle>
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
                    <SelectValue placeholder="Filter by team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Team Members</SelectItem>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
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
                    <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectGoal(goal)}>
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
          
          {selectedGoal && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Goal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedGoal.title}</h3>
                    <p className="text-sm text-gray-600">by {getGoalOwnerName(selectedGoal.userId)}</p>
                  </div>
                  <div>
                    <p className="text-sm">{selectedGoal.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span> {selectedGoal.category}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {selectedGoal.priority}
                    </div>
                    <div>
                      <span className="font-medium">Target Date:</span> {new Date(selectedGoal.targetDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Weightage:</span> {selectedGoal.weightage}%
                    </div>
                  </div>
                  {selectedGoal.feedback && (
                    <div>
                      <span className="font-medium">Feedback:</span>
                      <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedGoal.feedback}</p>
                    </div>
                  )}
                  {selectedGoal.milestones && selectedGoal.milestones.length > 0 && (
                    <div>
                      <span className="font-medium">Milestones:</span>
                      <ul className="text-sm space-y-1 mt-1">
                        {selectedGoal.milestones.map((milestone, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className={milestone.completed ? 'text-green-600' : 'text-gray-500'}>
                              {milestone.completed ? '✓' : '○'}
                            </span>
                            {milestone.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
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

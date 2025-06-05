
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Target, ArrowDown, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TeamAnalytics from '@/components/manager/TeamAnalytics';
import ReportsTab from '@/components/manager/ReportsTab';
import AllGoalsTab from '@/components/manager/AllGoalsTab';
import ReviewGoalsTab from '@/components/manager/ReviewGoalsTab';
import RateGoalsTab from '@/components/manager/RateGoalsTab';

const ManagerDashboard = () => {
  const { getTeamGoals, approveGoal, rejectGoal, returnGoalForRevision, updateGoal } = useGoals();
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
  
  // Get goals that are submitted for review (ready for rating)
  const submittedGoals = teamGoals.filter(goal => goal.status === 'submitted');
  
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

  const handleRateGoal = (rating: number, comment: string) => {
    if (!selectedGoal) return;
    
    const updatedGoal = {
      ...selectedGoal,
      rating,
      ratingComment: comment,
      status: 'final_approved' as const,
      updatedAt: new Date().toISOString()
    };
    
    updateGoal(updatedGoal);
    toast({
      title: 'Goal Rated',
      description: `You've rated "${selectedGoal.title}" with ${rating} stars`,
      duration: 3000,
    });
    
    setSelectedGoal(null);
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
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Review Goals</span>
            {pendingGoals.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingGoals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Rate Goals</span>
            {submittedGoals.length > 0 && (
              <span className="ml-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {submittedGoals.length}
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
          <ReviewGoalsTab
            pendingGoals={pendingGoals}
            teamMembers={teamMembers}
            selectedUserId={selectedUserId}
            selectedGoal={selectedGoal}
            feedback={feedback}
            onUserChange={setSelectedUserId}
            onSelectGoal={handleSelectGoal}
            onFeedbackChange={setFeedback}
            onApprove={handleApprove}
            onReject={handleReject}
            onReturnForRevision={handleReturnForRevision}
            getGoalOwnerName={getGoalOwnerName}
          />
        </TabsContent>

        <TabsContent value="submitted">
          <RateGoalsTab
            submittedGoals={submittedGoals}
            teamMembers={teamMembers}
            selectedUserId={selectedUserId}
            selectedGoal={selectedGoal}
            feedback={feedback}
            onUserChange={setSelectedUserId}
            onSelectGoal={handleSelectGoal}
            onFeedbackChange={setFeedback}
            onApprove={handleApprove}
            onReject={handleReject}
            onReturnForRevision={handleReturnForRevision}
            onRateGoal={handleRateGoal}
            getGoalOwnerName={getGoalOwnerName}
          />
        </TabsContent>

        <TabsContent value="all-goals">
          <AllGoalsTab
            filteredGoals={filteredGoals}
            teamMembers={teamMembers}
            selectedUserId={selectedUserId}
            selectedStatus={selectedStatus}
            selectedGoal={selectedGoal}
            onUserChange={setSelectedUserId}
            onStatusChange={setSelectedStatus}
            onSelectGoal={handleSelectGoal}
            getGoalOwnerName={getGoalOwnerName}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="team">
          <TeamAnalytics />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;

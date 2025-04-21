import { useGoals } from '@/contexts/goal';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, CheckCircle, Target, XCircle, ArrowDown } from 'lucide-react';

const ManagerDashboard = () => {
  const { getTeamGoals, approveGoal, rejectGoal, returnGoalForRevision } = useGoals();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const teamGoals = getTeamGoals();
  const pendingGoals = teamGoals.filter(goal => goal.status === 'submitted');
  
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Review Goals</span>
            {pendingGoals.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingGoals.length}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Goals Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingGoals.length > 0 ? (
                  <div className="space-y-4">
                    {pendingGoals.map((goal) => (
                      <div 
                        key={goal.id}
                        className={`border rounded-lg p-4 cursor-pointer transition hover:border-blue-300 ${
                          selectedGoal?.id === goal.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectGoal(goal)}
                      >
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {goal.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No goals pending your review
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedGoal && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium text-lg">{selectedGoal.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedGoal.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="text-sm font-medium">Category:</span>
                      <span className="ml-2 text-sm">{selectedGoal.category}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Priority:</span>
                      <span className="ml-2 text-sm">{selectedGoal.priority}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Target Date:</span>
                      <span className="ml-2 text-sm">
                        {new Date(selectedGoal.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {selectedGoal.milestones && selectedGoal.milestones.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Milestones:</h4>
                      <ul className="list-disc ml-5 text-sm space-y-1">
                        {selectedGoal.milestones.map((milestone) => (
                          <li key={milestone.id}>{milestone.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-1">Feedback</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter feedback for the employee"
                      className="w-full h-24"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      onClick={handleApprove}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      onClick={handleReturnForRevision}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <ArrowDown className="h-4 w-4" />
                      <span>Request Revisions</span>
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

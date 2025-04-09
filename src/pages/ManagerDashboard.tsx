
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useGoals } from '@/contexts/GoalContext';
import { Goal } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle2, 
  XCircle, 
  CornerDownLeft, 
  AlertCircle, 
  Calendar, 
  Filter,
  SortAsc, 
  SortDesc
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { goals, approveGoal, rejectGoal, returnGoalForRevision, getTeamGoals } = useGoals();
  
  // Get team members' goals (goals submitted to this manager)
  const teamGoals = getTeamGoals();

  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<string>('submitted');
  const [sortField, setSortField] = useState<string>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // State for selected goal and feedback dialogs
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Filter goals by status
  const filteredGoals = teamGoals.filter(goal => 
    statusFilter === 'all' ? true : goal.status === statusFilter
  );

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortField === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } 
    
    if (sortField === 'submissionDate') {
      const aDate = new Date(a.targetDate).getTime();
      const bDate = new Date(b.targetDate).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }

    // Default string comparison for other fields
    const aValue = String(a[sortField as keyof Goal] || '');
    const bValue = String(b[sortField as keyof Goal] || '');
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle approval action
  const handleApprove = () => {
    if (selectedGoal) {
      approveGoal(selectedGoal.id);
      setSelectedGoal(null);
    }
  };

  // Handle rejection action
  const handleReject = () => {
    if (selectedGoal && feedback.trim()) {
      rejectGoal(selectedGoal.id, feedback);
      setShowRejectDialog(false);
      setSelectedGoal(null);
      setFeedback('');
    }
  };

  // Handle return for revision action
  const handleReturnForRevision = () => {
    if (selectedGoal && feedback.trim()) {
      returnGoalForRevision(selectedGoal.id, feedback);
      setShowRevisionDialog(false);
      setSelectedGoal(null);
      setFeedback('');
    }
  };

  // Count of goals pending approval
  const pendingApprovalCount = teamGoals.filter(goal => goal.status === 'submitted').length;
  
  // Recently actioned goals (approved or rejected in the last 7 days)
  const recentlyActionedGoals = teamGoals.filter(goal => 
    (goal.status === 'approved' || goal.status === 'rejected') && 
    new Date(goal.targetDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).slice(0, 3); // Get most recent 3

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name}!</p>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>Active employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2</div>
            <p className="text-sm text-gray-500">Direct reports</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
            <CardDescription>Goals waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{pendingApprovalCount}</div>
            <p className="text-sm text-gray-500">Submitted goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Goal Completion</CardTitle>
            <CardDescription>Overall team progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {teamGoals.length > 0 
                ? Math.round((teamGoals.filter(g => g.status === 'approved').length / teamGoals.length) * 100) 
                : 0}%
            </div>
            <p className="text-sm text-gray-500">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Area */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentlyActionedGoals.length > 0 ? (
          <div className="space-y-3">
            {recentlyActionedGoals.map(goal => (
              <div 
                key={goal.id}
                className={`p-3 rounded-md flex items-start space-x-3 ${
                  goal.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {goal.status === 'approved' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{goal.title}</p>
                  <p className="text-sm text-gray-500">
                    {goal.status === 'approved' ? 'Approved' : 'Rejected'} - {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent goal approvals or rejections.</p>
        )}
      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Goals</h2>
          
          <div className="flex space-x-2">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {sortedGoals.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p>No goals found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('userId')}
                      className="flex items-center font-medium"
                    >
                      Employee
                      {sortField === 'userId' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="ml-1 h-4 w-4" /> : 
                          <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('title')}
                      className="flex items-center font-medium"
                    >
                      Goal Title
                      {sortField === 'title' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="ml-1 h-4 w-4" /> : 
                          <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('category')}
                      className="flex items-center font-medium whitespace-nowrap"
                    >
                      Category
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="ml-1 h-4 w-4" /> : 
                          <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('priority')}
                      className="flex items-center font-medium"
                    >
                      Priority
                      {sortField === 'priority' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="ml-1 h-4 w-4" /> : 
                          <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('submissionDate')}
                      className="flex items-center font-medium"
                    >
                      Target Date
                      {sortField === 'submissionDate' && (
                        sortDirection === 'asc' ? 
                          <SortAsc className="ml-1 h-4 w-4" /> : 
                          <SortDesc className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGoals.map(goal => (
                  <TableRow 
                    key={goal.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <TableCell>{goal.userId}</TableCell>
                    <TableCell>{goal.title}</TableCell>
                    <TableCell>{goal.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                          goal.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }
                      >
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          goal.status === 'approved' ? 'bg-green-100 text-green-700' :
                          goal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          goal.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }
                      >
                        {goal.status === 'submitted' ? 'Pending Approval' :
                          goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {goal.status === 'submitted' && (
                        <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGoal(goal);
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Goal Details Dialog */}
      {selectedGoal && (
        <Dialog open={selectedGoal !== null} onOpenChange={(open) => !open && setSelectedGoal(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Goal Review</DialogTitle>
              <DialogDescription>
                Review and take action on this goal submission
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Goal Title</h3>
                <p className="text-base">{selectedGoal.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-sm text-gray-700">{selectedGoal.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-sm">{selectedGoal.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedGoal.priority === 'high' ? 'bg-red-100 text-red-700' :
                      selectedGoal.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }
                  >
                    {selectedGoal.priority.charAt(0).toUpperCase() + selectedGoal.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Target Date</h3>
                  <p className="text-sm">{new Date(selectedGoal.targetDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedGoal.status === 'approved' ? 'bg-green-100 text-green-700' :
                      selectedGoal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      selectedGoal.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {selectedGoal.status === 'submitted' ? 'Pending Approval' :
                      selectedGoal.status.charAt(0).toUpperCase() + selectedGoal.status.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Employee</h3>
                <p className="text-sm">ID: {selectedGoal.userId}</p>
              </div>
              
              {selectedGoal.feedback && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-blue-700">Feedback</h3>
                  <p className="text-sm text-gray-700 mt-1">{selectedGoal.feedback}</p>
                </div>
              )}
            </div>
            
            {selectedGoal.status === 'submitted' && (
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRevisionDialog(true)}
                  className="w-full sm:w-auto flex items-center"
                >
                  <CornerDownLeft className="mr-2 h-4 w-4" />
                  Request Revisions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectDialog(true)}
                  className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 flex items-center"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Goal</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This feedback will be shared with the employee.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Explain why this goal is being rejected..."
              className="min-h-[100px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={!feedback.trim()}
            >
              Reject Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Revisions Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Revisions</DialogTitle>
            <DialogDescription>
              Provide feedback for the employee to revise this goal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="What changes would you like to see in this goal?"
              className="min-h-[100px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRevisionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReturnForRevision}
              disabled={!feedback.trim()}
            >
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;

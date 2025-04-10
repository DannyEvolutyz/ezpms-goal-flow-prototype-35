
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Goal } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar,
  Clock,
  Send,
  ArrowUpRight,
  MessageCircle,
  Edit,
  AlertTriangle,
  Trash,
  Filter,
  SortAsc,
  SortDesc,
  Eye
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import GoalEditForm from './GoalEditForm';

const GoalsListComponent = () => {
  const { user } = useAuth();
  const { goals, submitGoal, deleteGoal } = useGoals();
  const navigate = useNavigate();
  
  // States for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('targetDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // State for viewing and submitting goals
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [confirmationNote, setConfirmationNote] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // State for editing goals
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  // Get user's goals
  const userGoals = goals.filter(goal => goal.userId === user?.id);
  
  // Filter goals by status
  const filteredGoals = userGoals.filter(goal => 
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
    
    if (sortField === 'targetDate') {
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
  
  // Handle goal submission
  const handleSubmitGoal = () => {
    if (selectedGoal) {
      submitGoal(selectedGoal.id);
      setShowSubmitDialog(false);
      setSelectedGoal(null);
      setConfirmationNote('');
    }
  };
  
  // Handle goal deletion
  const handleDeleteGoal = () => {
    if (selectedGoal) {
      deleteGoal(selectedGoal.id);
      setShowDeleteDialog(false);
      setSelectedGoal(null);
    }
  };
  
  // Handle editing a goal
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };
  
  // Get appropriate actions based on goal status
  const getGoalActions = (goal: Goal) => {
    switch (goal.status) {
      case 'draft':
        return (
          <>
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGoal(goal);
                setShowSubmitDialog(true);
              }}
              className="mr-2"
            >
              <Send className="mr-1 h-4 w-4" />
              Submit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditGoal(goal);
              }}
              className="mr-2"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGoal(goal);
                setShowDeleteDialog(true);
              }}
            >
              <Trash className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </>
        );
      case 'under_review':
        return (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditGoal(goal);
              }}
              className="mr-2"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGoal(goal);
                setShowSubmitDialog(true);
              }}
            >
              <Send className="mr-1 h-4 w-4" />
              Resubmit
            </Button>
          </>
        );
      case 'rejected':
        return (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditGoal(goal);
              }}
              className="mr-2"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGoal(goal);
                setShowSubmitDialog(true);
              }}
            >
              <Send className="mr-1 h-4 w-4" />
              Resubmit
            </Button>
          </>
        );
      default:
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGoal(goal);
            }}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
        );
    }
  };

  if (editingGoal) {
    return <GoalEditForm goal={editingGoal} onCancel={() => setEditingGoal(null)} />;
  }

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Goals</h2>
        
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 h-9">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Goals Table */}
      {userGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 mb-4">You haven't created any goals yet.</p>
            <Button onClick={() => navigate('/goals/create')}>Create Your First Goal</Button>
          </CardContent>
        </Card>
      ) : sortedGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500">No goals match your current filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
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
                    className="flex items-center font-medium"
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
                    onClick={() => handleSort('targetDate')}
                    className="flex items-center font-medium"
                  >
                    Target Date
                    {sortField === 'targetDate' && (
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
                  <TableCell className="font-medium">{goal.title}</TableCell>
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
                        goal.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {goal.status === 'submitted' ? 'Pending Approval' :
                        goal.status === 'under_review' ? 'Needs Revision' :
                        goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      {getGoalActions(goal)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Goal Details Dialog */}
      {selectedGoal && (
        <Dialog open={selectedGoal !== null} onOpenChange={(open) => !open && setSelectedGoal(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedGoal.title}</DialogTitle>
              <DialogDescription>
                {selectedGoal.status === 'rejected' || selectedGoal.status === 'under_review'
                  ? 'This goal needs your attention'
                  : 'Goal details'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
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
                      selectedGoal.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {selectedGoal.status === 'submitted' ? 'Pending Approval' :
                      selectedGoal.status === 'under_review' ? 'Needs Revision' :
                      selectedGoal.status.charAt(0).toUpperCase() + selectedGoal.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {(selectedGoal.status === 'rejected' || selectedGoal.status === 'under_review') && selectedGoal.feedback && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-blue-700 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Manager Feedback
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{selectedGoal.feedback}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setSelectedGoal(null)}
              >
                Close
              </Button>
              
              <div className="space-x-2">
                {(selectedGoal.status === 'draft' || 
                  selectedGoal.status === 'rejected' || 
                  selectedGoal.status === 'under_review') && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedGoal(null);
                        handleEditGoal(selectedGoal);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    
                    {(selectedGoal.status === 'draft' ||
                      selectedGoal.status === 'rejected' || 
                      selectedGoal.status === 'under_review') && (
                      <Button 
                        onClick={() => {
                          setShowSubmitDialog(true);
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {selectedGoal.status === 'draft' ? 'Submit' : 'Resubmit'}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Submit Goal Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedGoal?.status === 'draft' ? 'Submit Goal for Approval' : 'Resubmit Goal'}
            </DialogTitle>
            <DialogDescription>
              {selectedGoal?.status === 'draft' 
                ? 'Once submitted, your goal will be reviewed by your manager.'
                : 'Your revised goal will be submitted to your manager for review.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              {selectedGoal?.status === 'draft' 
                ? 'Are you sure this goal is ready for review?'
                : 'Have you addressed the feedback provided by your manager?'}
            </p>
            
            <Textarea
              placeholder="Optional: Add a note for your manager..."
              value={confirmationNote}
              onChange={(e) => setConfirmationNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitGoal}
            >
              {selectedGoal?.status === 'draft' ? 'Submit Goal' : 'Resubmit Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Goal Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Deleting this goal will permanently remove it from your records.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteGoal}
            >
              Delete Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsListComponent;

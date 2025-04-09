
import { useState, useMemo } from 'react';
import { useGoals } from '@/contexts/GoalContext';
import { Goal } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock4
} from 'lucide-react';

const GoalsListComponent = () => {
  const { goals, submitGoal } = useGoals();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateDesc');

  // Status badge styling and icon
  const getStatusBadge = (status: Goal['status']) => {
    switch (status) {
      case 'draft':
        return { color: 'bg-gray-200 text-gray-700', icon: <Circle className="h-4 w-4" /> };
      case 'submitted':
        return { color: 'bg-blue-200 text-blue-700', icon: <Clock4 className="h-4 w-4" /> };
      case 'under_review':
        return { color: 'bg-yellow-200 text-yellow-700', icon: <Clock className="h-4 w-4" /> };
      case 'approved':
        return { color: 'bg-green-200 text-green-700', icon: <CheckCircle2 className="h-4 w-4" /> };
      case 'rejected':
        return { color: 'bg-red-200 text-red-700', icon: <AlertCircle className="h-4 w-4" /> };
      default:
        return { color: 'bg-gray-200 text-gray-700', icon: <Circle className="h-4 w-4" /> };
    }
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Filter and sort goals
  const filteredAndSortedGoals = useMemo(() => {
    let filteredGoals = [...goals];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredGoals = filteredGoals.filter(goal => goal.status === statusFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'dateAsc':
        return filteredGoals.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
      case 'dateDesc':
        return filteredGoals.sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime());
      case 'priorityAsc':
        return filteredGoals.sort((a, b) => {
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        });
      case 'priorityDesc':
        return filteredGoals.sort((a, b) => {
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        });
      default:
        return filteredGoals;
    }
  }, [goals, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold text-blue-600">Your Goals</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateDesc">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date (Newest)</span>
                  </div>
                </SelectItem>
                <SelectItem value="dateAsc">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date (Oldest)</span>
                  </div>
                </SelectItem>
                <SelectItem value="priorityDesc">
                  <div className="flex items-center">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    <span>Priority (High-Low)</span>
                  </div>
                </SelectItem>
                <SelectItem value="priorityAsc">
                  <div className="flex items-center">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    <span>Priority (Low-High)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredAndSortedGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No goals found. Create your first goal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedGoals.map((goal) => {
            const statusBadge = getStatusBadge(goal.status);
            
            return (
              <Card key={goal.id} className="border-l-4" style={{ borderLeftColor: goal.priority === 'high' ? '#f87171' : goal.priority === 'medium' ? '#fbbf24' : '#4ade80' }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md font-medium">{goal.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityBadge(goal.priority)} variant="outline">
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </Badge>
                      <Badge className={statusBadge.color} variant="outline">
                        <span className="flex items-center gap-1">
                          {statusBadge.icon}
                          {goal.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>Category: {goal.category}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  {goal.feedback && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md text-sm">
                      <p className="font-medium text-blue-700">Feedback:</p>
                      <p className="text-gray-600">{goal.feedback}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {goal.status === 'draft' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => submitGoal(goal.id)}
                    >
                      Submit for Approval
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsListComponent;

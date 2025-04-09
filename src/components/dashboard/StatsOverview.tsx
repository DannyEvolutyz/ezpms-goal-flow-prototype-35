
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatsOverview = () => {
  const { user } = useAuth();
  const { goals, getGoalsByStatus, getTeamGoals } = useGoals();
  const isManager = user?.role === 'manager';
  
  // Get statistics based on user role
  const userGoals = isManager ? getTeamGoals() : goals.filter(goal => goal.userId === user?.id);
  const approvedGoals = userGoals.filter(goal => goal.status === 'approved');
  const pendingGoals = userGoals.filter(goal => goal.status === 'submitted');
  const rejectedGoals = userGoals.filter(goal => goal.status === 'rejected');
  
  // Calculate completion rate
  const completionRate = userGoals.length > 0 
    ? Math.round((approvedGoals.length / userGoals.length) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            {isManager ? 'Team Goals' : 'My Goals'}
          </CardTitle>
          <CardDescription>
            {isManager ? 'Total goals across team' : 'Your total goals'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{userGoals.length}</div>
          <p className="text-sm text-gray-500">
            {isManager ? 'Active team goals' : 'Total goals created'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-500" />
            {isManager ? 'Pending Review' : 'Pending Goals'}
          </CardTitle>
          <CardDescription>
            {isManager ? 'Goals awaiting your review' : 'Goals awaiting approval'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">{pendingGoals.length}</div>
          <p className="text-sm text-gray-500">
            {isManager ? 'Submitted by team' : 'Awaiting manager approval'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            {isManager ? 'Approved Goals' : 'Approved Goals'}
          </CardTitle>
          <CardDescription>
            {isManager ? 'Goals you approved' : 'Your approved goals'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{approvedGoals.length}</div>
          <p className="text-sm text-gray-500">
            {isManager ? 'Approved team goals' : 'Goals accepted by your manager'}
          </p>
        </CardContent>
      </Card>
      
      {isManager ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              Completion Rate
            </CardTitle>
            <CardDescription>Team goal achievement rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
            <p className="text-sm text-gray-500">Overall progress</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              Rejected Goals
            </CardTitle>
            <CardDescription>Goals needing revision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{rejectedGoals.length}</div>
            <p className="text-sm text-gray-500">Requiring attention</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsOverview;

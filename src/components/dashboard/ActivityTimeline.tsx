
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Goal } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActivityTimeline = () => {
  const { user } = useAuth();
  const { goals } = useGoals();
  const isManager = user?.role === 'manager';
  
  // For a real app, this would be actual activity data from a backend
  // Here we're simulating activity based on goals data
  const getActivities = () => {
    if (isManager) {
      // Manager sees team goal activities
      return goals
        .filter(goal => goal.userId !== user?.id)
        .filter(goal => ['submitted', 'approved', 'rejected'].includes(goal.status))
        .slice(0, 5)
        .map(goal => ({
          id: `activity-${goal.id}`,
          goalId: goal.id,
          type: goal.status,
          date: new Date(goal.targetDate).toISOString(),
          userId: goal.userId,
          goalTitle: goal.title
        }));
    } else {
      // Employee sees their own goal activities
      return goals
        .filter(goal => goal.userId === user?.id)
        .filter(goal => goal.status !== 'draft')
        .slice(0, 5)
        .map(goal => ({
          id: `activity-${goal.id}`,
          goalId: goal.id,
          type: goal.status,
          date: new Date(goal.targetDate).toISOString(),
          feedback: goal.feedback,
          goalTitle: goal.title
        }));
    }
  };
  
  const activities = getActivities();
  
  // Helper to get icon by activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'under_review':
        return <ArrowRight className="h-5 w-5 text-amber-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper to get message by activity type
  const getActivityMessage = (activity: any) => {
    if (isManager) {
      switch (activity.type) {
        case 'submitted':
          return `Employee ${activity.userId} submitted a new goal: "${activity.goalTitle}"`;
        case 'approved':
          return `You approved a goal: "${activity.goalTitle}"`;
        case 'rejected':
          return `You rejected a goal: "${activity.goalTitle}"`;
        default:
          return `Activity related to goal: "${activity.goalTitle}"`;
      }
    } else {
      switch (activity.type) {
        case 'submitted':
          return `You submitted goal "${activity.goalTitle}" for approval`;
        case 'approved':
          return `Your goal "${activity.goalTitle}" was approved`;
        case 'rejected':
          return `Your goal "${activity.goalTitle}" was rejected`;
        case 'under_review':
          return `Your goal "${activity.goalTitle}" was returned for revision`;
        default:
          return `Activity related to goal: "${activity.goalTitle}"`;
      }
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {getActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  
                  {activity.feedback && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded-md border border-gray-100">
                      <p className="font-medium text-gray-700">Feedback:</p>
                      <p className="text-gray-600">{activity.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No recent activity to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;


import { useAuth } from '@/contexts/AuthContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import GoalProgressChart from '@/components/dashboard/GoalProgressChart';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useGoals } from '@/contexts/GoalContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { getGoalsByStatus } = useGoals();
  
  // Show loading state while auth is being checked
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 mb-6" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  // Filter goals by status to check what needs attention
  const underReviewGoals = getGoalsByStatus('under_review');
  const rejectedGoals = getGoalsByStatus('rejected');
  const needsAttentionCount = underReviewGoals.length + rejectedGoals.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeBanner needsAttentionCount={needsAttentionCount} />
      <StatsOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgressChart />
        <ActivityTimeline />
      </div>
    </div>
  );
};

export default Index;

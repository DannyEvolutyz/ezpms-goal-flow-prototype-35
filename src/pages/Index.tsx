
import { useAuth } from '@/contexts/AuthContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import GoalProgressChart from '@/components/dashboard/GoalProgressChart';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeBanner />
      <StatsOverview />
      <GoalProgressChart />
      <ActivityTimeline />
    </div>
  );
};

export default Index;

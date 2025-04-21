import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsOverview from '@/components/dashboard/StatsOverview';
import GoalProgressChart from '@/components/dashboard/GoalProgressChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

const Dashboard = () => {
  const { getGoalsByStatus } = useGoals();
  const { user } = useAuth();
  
  // Get goals that need attention (rejected or under review)
  const rejectedGoals = getGoalsByStatus('rejected');
  const underReviewGoals = getGoalsByStatus('under_review');
  const needsAttentionCount = rejectedGoals.length + underReviewGoals.length;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <WelcomeBanner needsAttentionCount={needsAttentionCount} />
      <StatsOverview />
      <GoalProgressChart />
      <ActivityTimeline />
    </div>
  );
};

export default Dashboard;

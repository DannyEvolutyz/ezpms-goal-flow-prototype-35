import { useState } from 'react';
import { useGoals } from '@/contexts/goal';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsOverview from '@/components/dashboard/StatsOverview';
import GoalProgressChart from '@/components/dashboard/GoalProgressChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

const Dashboard = () => {
  const { getGoalsByStatus } = useGoals();
  const { user } = useAuth();
  const [showPersonalDashboard, setShowPersonalDashboard] = useState(true);
  
  // Get goals that need attention (rejected or under review)
  const rejectedGoals = getGoalsByStatus('rejected');
  const underReviewGoals = getGoalsByStatus('under_review');
  const needsAttentionCount = rejectedGoals.length + underReviewGoals.length;

  const isAdmin = user?.role === 'admin';

  // Admin users always see personal dashboard without toggle
  if (isAdmin || showPersonalDashboard) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personal Dashboard</h1>
          {!isAdmin && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Team Dashboard</span>
              <Switch
                checked={showPersonalDashboard}
                onCheckedChange={setShowPersonalDashboard}
              />
              <span className="text-sm font-medium">Personal Dashboard</span>
            </div>
          )}
        </div>
        <WelcomeBanner needsAttentionCount={needsAttentionCount} />
        <StatsOverview />
        <GoalProgressChart />
        <ActivityTimeline />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">Team Dashboard</span>
          <Switch
            checked={showPersonalDashboard}
            onCheckedChange={setShowPersonalDashboard}
          />
          <span className="text-sm font-medium">Personal Dashboard</span>
        </div>
      </div>
      <WelcomeBanner needsAttentionCount={needsAttentionCount} />
      <StatsOverview />
      <GoalProgressChart />
      <ActivityTimeline />
    </div>
  );
};

export default Dashboard;

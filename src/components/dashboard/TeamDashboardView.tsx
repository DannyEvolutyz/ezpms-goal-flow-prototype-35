import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { 
  FileCheck,
  BarChart3,
  Clock
} from 'lucide-react';

const TeamDashboardView = () => {
  const { user, getAllUsers } = useAuth();
  const { getTeamGoals, goals } = useGoals();
  
  const allUsers = getAllUsers();
  const teamGoals = getTeamGoals();
  
  const teamMembers = allUsers.filter(u => u.role === 'member' || (u.role === 'manager' && u.id !== user?.id));
  
  const pendingReview = teamGoals.filter(g => g.status === 'pending_approval');
  const approvedGoals = teamGoals.filter(g => g.status === 'approved');
  
  const completionRate = teamGoals.length > 0 
    ? Math.round((approvedGoals.length / teamGoals.length) * 100) 
    : 0;

  const chartData = [
    { name: 'Draft', value: teamGoals.filter(g => g.status === 'draft').length, color: '#9ca3af' },
    { name: 'Pending', value: pendingReview.length, color: '#f59e0b' },
    { name: 'Approved', value: approvedGoals.length, color: '#22c55e' },
    { name: 'Rejected', value: teamGoals.filter(g => g.status === 'rejected').length, color: '#ef4444' },
    { name: 'Submitted', value: teamGoals.filter(g => g.status === 'submitted').length, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  // Upcoming deadlines
  const now = new Date();
  const upcomingGoals = teamGoals
    .filter(g => new Date(g.targetDate) > now)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 5);

  // Recent activity
  const recentGoals = [...teamGoals]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  const getOwnerName = (userId: string) => {
    const u = allUsers.find(u => u.id === userId);
    return u ? u.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border-2 border-[hsl(36,100%,50%)] bg-gradient-to-r from-[hsl(36,100%,93%)] to-[hsl(36,100%,96%)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Welcome back, {user?.email || user?.name}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team's performance goals and track their progress.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-foreground/20 bg-background">
              <Link to="/manager" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Review Goals
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-foreground/20 bg-background">
              <Link to="/manager" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Team Performance
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-[hsl(36,100%,80%)] bg-[hsl(36,100%,97%)]">
          <CardContent className="p-5">
            <p className="text-xs font-bold tracking-wider text-[hsl(36,100%,40%)] uppercase">Team Goals</p>
            <p className="text-sm text-muted-foreground mt-1">Total goals across team</p>
            <p className="text-3xl font-bold text-[hsl(36,100%,50%)] mt-3">{teamGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Active team goals</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[hsl(36,100%,80%)] bg-[hsl(36,100%,97%)]">
          <CardContent className="p-5">
            <p className="text-xs font-bold tracking-wider text-[hsl(36,100%,40%)] uppercase">Pending Review</p>
            <p className="text-sm text-muted-foreground mt-1">Goals awaiting your review</p>
            <p className="text-3xl font-bold text-[hsl(36,100%,50%)] mt-3">{pendingReview.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Submitted by team</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-[hsl(142,71%,80%)] bg-[hsl(142,71%,97%)]">
          <CardContent className="p-5">
            <p className="text-xs font-bold tracking-wider text-[hsl(142,71%,35%)] uppercase">Approved Goals</p>
            <p className="text-sm text-muted-foreground mt-1">Goals you approved</p>
            <p className="text-3xl font-bold text-[hsl(36,100%,50%)] mt-3">{approvedGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Approved team goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card className="border-2 border-[hsl(36,100%,80%)] bg-[hsl(36,100%,97%)] max-w-md">
        <CardContent className="p-5">
          <p className="text-xs font-bold tracking-wider text-[hsl(36,100%,40%)] uppercase">Completion Rate</p>
          <p className="text-sm text-muted-foreground mt-1">Team goal achievement rate</p>
          <p className="text-3xl font-bold text-[hsl(36,100%,50%)] mt-3">{completionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Overall progress</p>
        </CardContent>
      </Card>

      {/* Team Goal Status + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-2 border-[hsl(36,100%,80%)] bg-[hsl(36,100%,97%)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Team Goal Status</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[200px]">
                <ChartContainer
                  config={{
                    Draft: { color: '#9ca3af' },
                    Pending: { color: '#f59e0b' },
                    Approved: { color: '#22c55e' },
                    Rejected: { color: '#ef4444' },
                    Submitted: { color: '#3b82f6' },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <div className="border-2 border-dashed border-[hsl(36,100%,70%)] rounded-lg px-8 py-6 bg-[hsl(36,100%,95%)]">
                  <p className="text-muted-foreground text-sm">No goal data to display</p>
                </div>
              </div>
            )}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-[hsl(210,100%,45%)]">Overall Completion</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-2 border-[hsl(36,100%,80%)] bg-[hsl(36,100%,97%)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingGoals.length > 0 ? (
              <div className="space-y-3">
                {upcomingGoals.map(goal => (
                  <div key={goal.id} className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getOwnerName(goal.userId)} · {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGoals.length > 0 ? (
            <div className="space-y-3">
              {recentGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">{getOwnerName(goal.userId)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{goal.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No recent activity to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDashboardView;

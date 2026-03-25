import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Plus,
  Eye
} from 'lucide-react';

const PersonalDashboardView = () => {
  const { user } = useAuth();
  const { goals } = useGoals();
  
  const myGoals = goals.filter(goal => goal.userId === user?.id);
  const pendingGoals = myGoals.filter(g => g.status === 'pending_approval');
  const approvedGoals = myGoals.filter(g => g.status === 'approved');
  const rejectedGoals = myGoals.filter(g => g.status === 'rejected');
  
  const completionRate = myGoals.length > 0 
    ? Math.round((approvedGoals.length / myGoals.length) * 100) 
    : 0;

  // Chart data
  const chartData = [
    { name: 'Draft', value: myGoals.filter(g => g.status === 'draft').length, color: 'hsl(var(--muted-foreground))' },
    { name: 'Pending', value: pendingGoals.length, color: 'hsl(45, 93%, 47%)' },
    { name: 'Approved', value: approvedGoals.length, color: 'hsl(142, 71%, 45%)' },
    { name: 'Rejected', value: rejectedGoals.length, color: 'hsl(0, 84%, 60%)' },
  ].filter(item => item.value > 0);

  // Upcoming deadlines
  const upcomingDeadlines = myGoals
    .filter(goal => new Date(goal.targetDate) > new Date())
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  // Recent activity from goals
  const recentGoals = [...myGoals]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-2 border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Welcome back, {user?.email || user?.name}!
              </h2>
              <p className="text-muted-foreground mt-1">
                Track your performance goals and career development.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/goals">
                  <Plus className="h-4 w-4" />
                  Create New Goal
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/goals">
                  <Eye className="h-4 w-4" />
                  View My Goals
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">My Goals</h3>
            <p className="text-sm text-muted-foreground mt-1">Your total goals</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-3">{myGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total goals created</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Pending Goals</h3>
            <p className="text-sm text-muted-foreground mt-1">Goals awaiting approval</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-3">{pendingGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Awaiting manager approval</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Approved Goals</h3>
            <p className="text-sm text-muted-foreground mt-1">Your approved goals</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-3">{approvedGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Goals accepted by your manager</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Rejected Goals</h3>
            <p className="text-sm text-muted-foreground mt-1">Goals needing revision</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-3">{rejectedGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Distribution + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">My Goals Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[200px]">
                <ChartContainer
                  config={{
                    Draft: { color: 'hsl(var(--muted-foreground))' },
                    Pending: { color: 'hsl(45, 93%, 47%)' },
                    Approved: { color: 'hsl(142, 71%, 45%)' },
                    Rejected: { color: 'hsl(0, 84%, 60%)' },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-lg">
                <p className="text-muted-foreground">No goal data to display</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Overall Completion</span>
              <span className="text-sm font-bold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map(goal => {
                  const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={goal.id} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{goal.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant={daysUntil <= 7 ? 'destructive' : 'secondary'} className="ml-2 shrink-0">
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGoals.length > 0 ? (
            <div className="space-y-3">
              {recentGoals.map(goal => (
                <div 
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      goal.status === 'approved' ? 'bg-emerald-500' :
                      goal.status === 'rejected' ? 'bg-rose-500' :
                      goal.status === 'pending_approval' ? 'bg-amber-500' :
                      'bg-muted-foreground'
                    }`} />
                    <span className="font-medium truncate">{goal.title}</span>
                  </div>
                  <Badge variant="outline" className="shrink-0 ml-2 capitalize">
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDashboardView;

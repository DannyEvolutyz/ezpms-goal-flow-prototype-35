import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  BarChart3, 
  BookOpen, 
  TrendingUp, 
  ClipboardList,
  Bell
} from 'lucide-react';

const quickActions = [
  { label: 'Goals', icon: Target, path: '/goals', description: 'Manage your goals' },
  { label: 'Dashboard', icon: BarChart3, path: '/dashboard', description: 'View analytics' },
  { label: 'Goal Bank', icon: BookOpen, path: '/admin', description: 'Browse templates' },
  { label: 'Performance', icon: TrendingUp, path: '/dashboard', description: 'Track progress' },
  { label: 'Reports', icon: ClipboardList, path: '/manager', description: 'View reports' },
];

const Index = () => {
  const { user } = useAuth();
  const { goals, getUserNotifications, getUnreadNotificationsCount } = useGoals();

  const myGoals = goals.filter(g => g.userId === user?.id);
  const pendingCount = myGoals.filter(g => g.status === 'pending_approval').length;
  const approvedCount = myGoals.filter(g => g.status === 'approved').length;
  const unreadNotifications = getUserNotifications().filter(n => !n.isRead);
  const unreadCount = getUnreadNotificationsCount();

  const upcomingDeadlines = myGoals
    .filter(g => {
      const target = new Date(g.targetDate);
      const now = new Date();
      const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 14;
    })
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 4);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome */}
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Welcome {user?.name},
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/20 bg-card shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.path}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-muted bg-background hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-7 w-7 text-foreground" />
                      </div>
                      <span className="text-sm font-semibold text-foreground text-center">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{myGoals.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Goals</p>
              </CardContent>
            </Card>
            <Card className="border border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </CardContent>
            </Card>
            <Card className="border border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{approvedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Approved</p>
              </CardContent>
            </Card>
            <Card className="border border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{unreadCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Unread Alerts</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* What's Today */}
          <Card className="border-2 border-primary/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">What's Today!</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map(goal => {
                    const daysLeft = Math.ceil(
                      (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={goal.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/40">
                        <p className="text-sm font-medium truncate flex-1">{goal.title}</p>
                        <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'} className="shrink-0 text-xs">
                          {daysLeft}d
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-2 border-primary/20 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {unreadNotifications.length > 0 ? (
                <div className="space-y-3">
                  {unreadNotifications.slice(0, 4).map(n => (
                    <div key={n.id} className="p-2 rounded-lg bg-muted/40">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

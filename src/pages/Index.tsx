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
  { label: 'Timesheets', icon: ClipboardList, path: '/goals', description: 'Manage timesheets' },
  { label: 'Leaves', icon: BookOpen, path: '/dashboard', description: 'Manage leaves' },
  { label: 'Trainings', icon: Target, path: '/admin', description: 'View trainings' },
  { label: 'Performance', icon: TrendingUp, path: '/dashboard', description: 'Track progress' },
  { label: 'Pay-slips', icon: BarChart3, path: '/manager', description: 'View pay-slips' },
];

const Index = () => {
  const { user } = useAuth();
  const { goals, getUserNotifications, getUnreadNotificationsCount } = useGoals();

  const myGoals = goals.filter(g => g.userId === user?.id);
  const unreadNotifications = getUserNotifications().filter(n => !n.isRead);

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
    <div
      className="min-h-[calc(100vh-64px)] py-8 px-4"
      style={{
        background: 'linear-gradient(135deg, hsl(33, 30%, 85%) 0%, hsl(35, 25%, 78%) 50%, hsl(30, 20%, 75%) 100%)',
      }}
    >
      <div className="container mx-auto">
        {/* Welcome */}
        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'Lato, sans-serif' }}>
          Welcome {user?.name},
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/30 bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.label}
                        to={action.path}
                        className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border/20 bg-card/60 hover:bg-primary/10 hover:border-primary/40 transition-all group"
                      >
                        <div className="h-16 w-16 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border/20 group-hover:shadow-md transition-shadow">
                          <Icon className="h-8 w-8 text-foreground" strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-semibold text-foreground text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                          {action.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-0">
            <Card className="border border-border/30 bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
              {/* Social Media Dashboard placeholder */}
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base font-bold text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Social Media Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{myGoals.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{myGoals.filter(g => g.status === 'approved').length}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{myGoals.filter(g => g.status === 'pending_approval').length}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* What's Today */}
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base font-bold text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
                  What's Today!
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingDeadlines.map(goal => {
                      const daysLeft = Math.ceil(
                        (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={goal.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/20">
                          <p className="text-sm font-medium truncate flex-1">{goal.title}</p>
                          <Badge variant={daysLeft <= 3 ? 'destructive' : 'secondary'} className="shrink-0 text-xs">
                            {daysLeft}d
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No upcoming deadlines</p>
                )}
              </CardContent>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Notifications */}
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-base font-bold" style={{ fontFamily: 'Lato, sans-serif' }}>
                    Notifications
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                {unreadNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {unreadNotifications.slice(0, 4).map(n => (
                      <div key={n.id} className="p-2 rounded-lg bg-muted/20">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No new notifications</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

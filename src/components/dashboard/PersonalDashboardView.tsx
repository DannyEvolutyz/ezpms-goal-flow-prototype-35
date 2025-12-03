import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Trophy
} from 'lucide-react';

const PersonalDashboardView = () => {
  const { user } = useAuth();
  const { goals, getGoalsByStatus } = useGoals();
  
  const myGoals = goals.filter(goal => goal.userId === user?.id);
  const draftGoals = myGoals.filter(g => g.status === 'draft');
  const pendingGoals = myGoals.filter(g => g.status === 'pending_approval');
  const approvedGoals = myGoals.filter(g => g.status === 'approved');
  const rejectedGoals = myGoals.filter(g => g.status === 'rejected');
  const underReviewGoals = myGoals.filter(g => g.status === 'under_review');
  
  const completionRate = myGoals.length > 0 
    ? Math.round((approvedGoals.length / myGoals.length) * 100) 
    : 0;
  
  const needsAttention = rejectedGoals.length + underReviewGoals.length;
  
  // Get upcoming deadlines
  const upcomingDeadlines = myGoals
    .filter(goal => new Date(goal.targetDate) > new Date())
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-primary-foreground">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Personal Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-primary-foreground/80 mb-6 max-w-lg">
            Track your career goals, monitor progress, and stay on top of your professional development.
          </p>
          
          {needsAttention > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{needsAttention} goal{needsAttention > 1 ? 's' : ''} need{needsAttention === 1 ? 's' : ''} your attention</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/goals" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Goal
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/goals" className="flex items-center gap-2">
                View All Goals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Total
              </Badge>
            </div>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{myGoals.length}</p>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">My Goals</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                Pending
              </Badge>
            </div>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{pendingGoals.length}</p>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80">Awaiting Approval</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Approved
              </Badge>
            </div>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{approvedGoals.length}</p>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">Goals Completed</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                Action
              </Badge>
            </div>
            <p className="text-3xl font-bold text-rose-900 dark:text-rose-100">{needsAttention}</p>
            <p className="text-sm text-rose-600/80 dark:text-rose-400/80">Needs Attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Deadlines Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-primary" />
              Goal Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="text-2xl font-bold text-primary">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{draftGoals.length}</p>
                  <p className="text-xs text-muted-foreground">In Draft</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{underReviewGoals.length}</p>
                  <p className="text-xs text-muted-foreground">Under Review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map(goal => {
                  const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 7;
                  
                  return (
                    <div 
                      key={goal.id}
                      className={`p-3 rounded-lg border ${isUrgent ? 'border-rose-200 bg-rose-50/50 dark:border-rose-800 dark:bg-rose-950/20' : 'border-border bg-muted/30'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{goal.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                goal.priority === 'high' ? 'border-rose-300 text-rose-700' :
                                goal.priority === 'medium' ? 'border-amber-300 text-amber-700' :
                                'border-emerald-300 text-emerald-700'
                              }`}
                            >
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={isUrgent ? 'destructive' : 'secondary'} className="ml-2 shrink-0">
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Goals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Goals
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/goals">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myGoals.length > 0 ? (
            <div className="space-y-3">
              {myGoals.slice(0, 5).map(goal => (
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
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No goals yet. Create your first goal!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDashboardView;

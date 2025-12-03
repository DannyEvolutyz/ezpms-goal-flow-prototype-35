import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  BarChart3,
  UserCheck,
  FileCheck,
  Eye
} from 'lucide-react';

const TeamDashboardView = () => {
  const { user, getAllUsers } = useAuth();
  const { getTeamGoals, goals } = useGoals();
  
  const allUsers = getAllUsers();
  const teamGoals = getTeamGoals();
  
  // Team members (excluding current user if manager)
  const teamMembers = allUsers.filter(u => u.role === 'member' || (u.role === 'manager' && u.id !== user?.id));
  
  // Goal statistics
  const pendingReview = teamGoals.filter(g => g.status === 'pending_approval');
  const approvedGoals = teamGoals.filter(g => g.status === 'approved');
  const rejectedGoals = teamGoals.filter(g => g.status === 'rejected');
  const submittedGoals = teamGoals.filter(g => g.status === 'submitted');
  
  const completionRate = teamGoals.length > 0 
    ? Math.round((approvedGoals.length / teamGoals.length) * 100) 
    : 0;

  // Chart data for goal status distribution
  const chartData = [
    { name: 'Draft', value: teamGoals.filter(g => g.status === 'draft').length, color: 'hsl(var(--muted-foreground))' },
    { name: 'Pending', value: pendingReview.length, color: 'hsl(45, 93%, 47%)' },
    { name: 'Approved', value: approvedGoals.length, color: 'hsl(142, 71%, 45%)' },
    { name: 'Rejected', value: rejectedGoals.length, color: 'hsl(0, 84%, 60%)' },
  ].filter(item => item.value > 0);

  // Goals by team member
  const goalsByMember = teamMembers.map(member => ({
    ...member,
    goalCount: teamGoals.filter(g => g.userId === member.id).length,
    approvedCount: teamGoals.filter(g => g.userId === member.id && g.status === 'approved').length,
    pendingCount: teamGoals.filter(g => g.userId === member.id && g.status === 'pending_approval').length,
  })).sort((a, b) => b.goalCount - a.goalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Team Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Team Performance Overview</h1>
          <p className="text-white/80 mb-6 max-w-lg">
            Monitor your team's goals, review submissions, and track overall progress across all team members.
          </p>
          
          {pendingReview.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{pendingReview.length} goal{pendingReview.length > 1 ? 's' : ''} awaiting your review</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-white text-violet-700 hover:bg-white/90">
              <Link to="/manager" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Review Goals
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/manager" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Team Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                Team
              </Badge>
            </div>
            <p className="text-3xl font-bold text-violet-900 dark:text-violet-100">{teamMembers.length}</p>
            <p className="text-sm text-violet-600/80 dark:text-violet-400/80">Team Members</p>
          </CardContent>
        </Card>
        
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
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{teamGoals.length}</p>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Team Goals</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                Review
              </Badge>
            </div>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{pendingReview.length}</p>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80">Pending Review</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Rate
              </Badge>
            </div>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{completionRate}%</p>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Status Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Goal Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[250px]">
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
                      innerRadius={50}
                      outerRadius={80}
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
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No goal data to display</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Team Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Overall Approval Rate</span>
                <span className="text-lg font-bold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{approvedGoals.length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <Clock className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{pendingReview.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                <AlertCircle className="h-5 w-5 mx-auto mb-1 text-rose-600" />
                <p className="text-xl font-bold text-rose-700 dark:text-rose-400">{rejectedGoals.length}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Goals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Goals by Team Member
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/manager">View details</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goalsByMember.length > 0 ? (
            <div className="space-y-3">
              {goalsByMember.slice(0, 5).map(member => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{member.goalCount}</p>
                      <p className="text-xs text-muted-foreground">Goals</p>
                    </div>
                    <div className="flex gap-1">
                      {member.approvedCount > 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {member.approvedCount} ✓
                        </Badge>
                      )}
                      {member.pendingCount > 0 && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          {member.pendingCount} ⏳
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No team members found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDashboardView;

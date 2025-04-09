
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/contexts/GoalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar } from 'lucide-react';

const GoalProgressChart = () => {
  const { user } = useAuth();
  const { goals, getTeamGoals } = useGoals();
  const isManager = user?.role === 'manager';
  
  // Get relevant goals based on user role
  const relevantGoals = isManager ? getTeamGoals() : goals.filter(goal => goal.userId === user?.id);
  
  // Calculate data for pie chart
  const draftCount = relevantGoals.filter(goal => goal.status === 'draft').length;
  const submittedCount = relevantGoals.filter(goal => goal.status === 'submitted').length;
  const approvedCount = relevantGoals.filter(goal => goal.status === 'approved').length;
  const rejectedCount = relevantGoals.filter(goal => goal.status === 'rejected').length;
  const underReviewCount = relevantGoals.filter(goal => goal.status === 'under_review').length;
  
  const chartData = [
    { name: 'Draft', value: draftCount, color: '#94a3b8' },
    { name: 'Submitted', value: submittedCount, color: '#3b82f6' },
    { name: 'Approved', value: approvedCount, color: '#22c55e' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
    { name: 'Under Review', value: underReviewCount, color: '#f59e0b' }
  ].filter(item => item.value > 0);
  
  // Get upcoming deadlines
  const upcomingDeadlines = [...relevantGoals]
    .filter(goal => 
      ['draft', 'submitted', 'under_review'].includes(goal.status) &&
      new Date(goal.targetDate) > new Date()
    )
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 3);
  
  const totalGoals = relevantGoals.length;
  const completionPercentage = totalGoals ? (approvedCount / totalGoals) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {isManager ? 'Team Goal Status' : 'My Goals Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  Draft: { color: '#94a3b8' },
                  Submitted: { color: '#3b82f6' },
                  Approved: { color: '#22c55e' },
                  Rejected: { color: '#ef4444' },
                  'Under Review': { color: '#f59e0b' },
                }}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No goal data to display</p>
            </div>
          )}
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-medium">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {upcomingDeadlines.map(goal => (
                <div 
                  key={goal.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{goal.title}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500">
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                      <span className="mx-2 text-gray-300">•</span>
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                          goal.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No upcoming deadlines
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalProgressChart;

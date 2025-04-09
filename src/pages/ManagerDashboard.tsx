
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>Active employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2</div>
            <p className="text-sm text-gray-500">Direct reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
            <CardDescription>Goals waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">0</div>
            <p className="text-sm text-gray-500">Submitted goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Goal Completion</CardTitle>
            <CardDescription>Overall team progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">0%</div>
            <p className="text-sm text-gray-500">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-gray-700">This is a placeholder. Future versions will show team statistics and actions.</p>
      </div>
    </div>
  );
};

export default ManagerDashboard;

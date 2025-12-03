import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import PersonalDashboardView from '@/components/dashboard/PersonalDashboardView';
import TeamDashboardView from '@/components/dashboard/TeamDashboardView';

const Dashboard = () => {
  const { user } = useAuth();
  const [showPersonalDashboard, setShowPersonalDashboard] = useState(true);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canToggle = isManager && !isAdmin;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Toggle Header - Only for managers */}
      {canToggle && (
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-3 bg-muted/50 rounded-full px-4 py-2">
            <span className={`text-sm font-medium transition-colors ${!showPersonalDashboard ? 'text-foreground' : 'text-muted-foreground'}`}>
              Team
            </span>
            <Switch
              checked={showPersonalDashboard}
              onCheckedChange={setShowPersonalDashboard}
            />
            <span className={`text-sm font-medium transition-colors ${showPersonalDashboard ? 'text-foreground' : 'text-muted-foreground'}`}>
              Personal
            </span>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      {isAdmin || showPersonalDashboard ? (
        <PersonalDashboardView />
      ) : (
        <TeamDashboardView />
      )}
    </div>
  );
};

export default Dashboard;

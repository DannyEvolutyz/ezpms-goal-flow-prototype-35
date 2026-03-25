import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalDashboardView from '@/components/dashboard/PersonalDashboardView';
import TeamDashboardView from '@/components/dashboard/TeamDashboardView';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal');

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canToggle = isManager || isAdmin;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Toggle Header */}
      {canToggle && (
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab('team')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'team'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Team Dashboard
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Personal Dashboard
            </button>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      {canToggle && activeTab === 'team' ? (
        <TeamDashboardView />
      ) : (
        <PersonalDashboardView />
      )}
    </div>
  );
};

export default Dashboard;

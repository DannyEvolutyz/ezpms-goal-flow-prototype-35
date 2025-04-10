
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Eye, CheckSquare, BarChart, AlertTriangle } from 'lucide-react';

interface WelcomeBannerProps {
  needsAttentionCount?: number;
}

const WelcomeBanner = ({ needsAttentionCount = 0 }: WelcomeBannerProps) => {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {isManager 
              ? "Manage your team's performance goals and track their progress." 
              : "Track your performance goals and career development."
            }
          </p>
          
          {!isManager && needsAttentionCount > 0 && (
            <div className="mt-2 flex items-center text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">You have {needsAttentionCount} {needsAttentionCount === 1 ? 'goal' : 'goals'} that need{needsAttentionCount === 1 ? 's' : ''} attention</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isManager ? (
            <>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/manager" className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>Review Goals</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-300">
                <Link to="/manager" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>Team Performance</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/goals" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Create New Goal</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-300">
                <Link to="/goals" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>View My Goals</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

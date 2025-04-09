
import { useAuth } from '@/contexts/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Redirect to the home page as we now use Index.tsx as our main dashboard
  return <Navigate to="/" replace />;
};

export default Dashboard;

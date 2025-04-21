
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-4">
          You don't have permission to access this page. This area requires higher privileges.
        </p>
        <div className="mt-8">
          <Button asChild className="mr-2">
            <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>{user ? "Return to Dashboard" : "Log In"}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

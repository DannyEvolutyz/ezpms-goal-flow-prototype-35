
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

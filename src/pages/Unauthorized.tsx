
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;

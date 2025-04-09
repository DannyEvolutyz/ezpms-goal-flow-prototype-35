
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

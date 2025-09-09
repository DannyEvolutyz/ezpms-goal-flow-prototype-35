
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  LogOut, 
  User, 
  Settings, 
  BarChart, 
  Target, 
  Users,
  Shield
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationTray from './NotificationTray';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (!user) {
    return (
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/0f761f30-dd58-41d6-9143-8874e4e3cf83.png" alt="Evolutyz" className="h-8" />
          </Link>
        </div>
      </header>
    );
  }
  
  const isManager = user.role === 'manager';
  const isAdmin = user.role === 'admin';
  
  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Goals', path: '/goals' },
    ...(isManager ? [{ label: 'Manager Dashboard', path: '/manager' }] : []),
    ...(isAdmin ? [{ label: 'Admin Dashboard', path: '/admin' }] : []),
    ...((isManager || isAdmin) ? [{ label: 'Organization', path: '/organization' }] : []),
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/0f761f30-dd58-41d6-9143-8874e4e3cf83.png" alt="Evolutyz" className="h-8" />
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <NotificationTray />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/goals" className="cursor-pointer flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  <span>Goals</span>
                </Link>
              </DropdownMenuItem>
              {isManager && (
                <DropdownMenuItem asChild>
                  <Link to="/manager" className="cursor-pointer flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Manager Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {(isManager || isAdmin) && (
                <DropdownMenuItem asChild>
                  <Link to="/organization" className="cursor-pointer flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Organization</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="mb-4">
                    <img src="/lovable-uploads/0f761f30-dd58-41d6-9143-8874e4e3cf83.png" alt="Evolutyz" className="h-6" />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="text-gray-600 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

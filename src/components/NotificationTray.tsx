import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellRing, Check, Info, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@/types';

const NotificationTray = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Safe import of useGoals to prevent the error
  let useGoals: any;
  let goalContext: any = {};
  
  try {
    // Dynamically import the hook to avoid the error when not within GoalProvider
    ({ useGoals } = require('@/contexts/goal'));
    goalContext = useGoals();
  } catch (error) {
    // If useGoals throws an error, we'll use empty functionality
    console.log('NotificationTray: GoalContext not available');
  }
  
  const {
    getUserNotifications = () => [],
    markNotificationAsRead = () => {},
    clearNotifications = () => {},
    getUnreadNotificationsCount = () => 0
  } = goalContext;
  
  useEffect(() => {
    try {
      // Get notifications only if the context is available
      const userNotifications = getUserNotifications();
      setNotifications(userNotifications || []);
      
      // Update unread count
      setUnreadCount(getUnreadNotificationsCount());
    } catch (error) {
      // Handle case where context is not available
      console.log('Could not load notifications');
    }
  }, [getUserNotifications, getUnreadNotificationsCount]);
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    try {
      markNotificationAsRead(notification.id);
      
      // Navigate to the target if there is one
      if (notification.targetType === 'goal' && notification.targetId) {
        navigate('/goals');
      }
    } catch (error) {
      console.log('Error handling notification click');
    }
    
    setOpen(false);
  };
  
  // Render notification icon based on type
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500 flex-shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
  };
  
  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  // If we couldn't get the context, return a simplified bell icon without notifications
  if (!useGoals) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {unreadCount > 0 ? (
                  <>
                    <BellRing className="h-5 w-5" />
                    <Badge 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] bg-red-500"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  </>
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          <h4 className="font-medium text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-auto text-xs px-2 py-1 hover:bg-gray-200"
              onClick={() => {
                try {
                  clearNotifications();
                  setUnreadCount(0);
                } catch (error) {
                  console.log('Error clearing notifications');
                }
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)] max-h-[400px]">
            <div className="py-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <button
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                      !notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mt-0.5">
                      {renderNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    )}
                  </button>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTray;

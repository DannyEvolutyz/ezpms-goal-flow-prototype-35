
import { Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseNotificationsParams {
  notifications: Notification[];
  user: any;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const useNotifications = ({
  notifications,
  user,
  setNotifications
}: UseNotificationsParams) => {
  
  const getUserNotifications = () => {
    if (!user) return [];
    return notifications
      .filter(n => n.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  
  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    }
  };
  
  const clearNotifications = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    
    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n)
      );
    }
  };
  
  const getUnreadNotificationsCount = () => {
    if (!user) return 0;
    return notifications.filter(n => n.userId === user.id && !n.isRead).length;
  };
  
  return {
    getUserNotifications,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount
  };
};

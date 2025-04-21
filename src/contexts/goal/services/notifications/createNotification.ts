
import { Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  targetType?: 'goal' | 'user';
  targetId?: string;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const createNotification = ({
  userId,
  title,
  message,
  type,
  targetType,
  targetId,
  setNotifications
}: CreateNotificationParams) => {
  const newNotification: Notification = {
    id: `notification-${Date.now()}`,
    userId,
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    targetType,
    targetId
  };
  
  setNotifications(prev => [newNotification, ...prev]);
  
  return newNotification;
};

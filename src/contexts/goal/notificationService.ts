
import { Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export const createNotification = (
  setNotifications: Dispatch<SetStateAction<Notification[]>>,
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  targetId?: string,
  targetType?: string
) => {
  const newNotification: Notification = {
    id: `notif-${Date.now()}`,
    userId,
    title,
    message,
    type,
    isRead: false,
    timestamp: new Date().toISOString(),
    targetId,
    targetType
  };

  setNotifications(prev => [newNotification, ...prev]);
  return newNotification;
};

export const markNotificationAsRead = (
  notificationId: string,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  setNotifications(prev => 
    prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    )
  );
};

export const clearNotifications = (
  userId: string,
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  setNotifications(prev => 
    prev.map(notification => 
      notification.userId === userId 
        ? { ...notification, isRead: true } 
        : notification
    )
  );
};

export const getUnreadNotificationsCount = (
  userId: string,
  notifications: Notification[]
) => {
  return notifications.filter(
    notification => notification.userId === userId && !notification.isRead
  ).length;
};

export const getUserNotifications = (
  userId: string,
  notifications: Notification[]
) => {
  return notifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

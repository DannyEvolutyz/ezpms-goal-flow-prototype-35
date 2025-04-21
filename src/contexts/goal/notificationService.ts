
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

interface GetUserNotificationsParams {
  notifications: Notification[];
  user: any;
}

export const getUserNotifications = ({
  notifications,
  user
}: GetUserNotificationsParams) => {
  if (!user) return [];
  
  return notifications
    .filter(notification => notification.userId === user.id)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

interface MarkNotificationAsReadParams {
  notifications: Notification[];
  notificationId: string;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const markNotificationAsRead = ({
  notifications,
  notificationId,
  setNotifications
}: MarkNotificationAsReadParams) => {
  setNotifications(prev =>
    prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    )
  );
};

interface ClearNotificationsParams {
  notifications: Notification[];
  user: any;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const clearNotifications = ({
  notifications,
  user,
  setNotifications
}: ClearNotificationsParams) => {
  if (!user) return;
  
  setNotifications(prev =>
    prev.map(notification =>
      notification.userId === user.id
        ? { ...notification, isRead: true }
        : notification
    )
  );
};

interface GetUnreadNotificationsCountParams {
  notifications: Notification[];
  user: any;
}

export const getUnreadNotificationsCount = ({
  notifications,
  user
}: GetUnreadNotificationsCountParams) => {
  if (!user) return 0;
  
  return notifications.filter(
    notification => notification.userId === user.id && !notification.isRead
  ).length;
};

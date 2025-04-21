
import { Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';

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

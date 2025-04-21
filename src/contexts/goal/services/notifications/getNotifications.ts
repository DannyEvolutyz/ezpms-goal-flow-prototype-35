
import { Notification } from '@/types';

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

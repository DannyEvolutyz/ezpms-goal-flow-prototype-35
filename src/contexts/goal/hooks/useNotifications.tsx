
import { Dispatch, SetStateAction } from 'react';
import {
  getUserNotifications as getUserNotificationsService,
  markNotificationAsRead as markNotificationAsReadService,
  clearNotifications as clearNotificationsService,
  getUnreadNotificationsCount as getUnreadNotificationsCountService
} from '../services/notifications';

interface UseNotificationsParams {
  notifications: any[];
  user: any;
  setNotifications: Dispatch<SetStateAction<any[]>>;
}

export const useNotifications = ({
  notifications,
  user,
  setNotifications
}: UseNotificationsParams) => {
  
  const getUserNotifications = () => {
    return getUserNotificationsService({
      notifications,
      user
    });
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    return markNotificationAsReadService({
      notifications,
      notificationId,
      setNotifications
    });
  };
  
  const clearNotifications = () => {
    return clearNotificationsService({
      notifications,
      user,
      setNotifications
    });
  };
  
  const getUnreadNotificationsCount = () => {
    return getUnreadNotificationsCountService({
      notifications,
      user
    });
  };
  
  return {
    getUserNotifications,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationsCount
  };
};

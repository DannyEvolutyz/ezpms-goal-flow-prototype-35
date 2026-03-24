
import { Notification } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  targetType?: string;
  targetId?: string;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const createNotification = async ({
  userId,
  title,
  message,
  type,
  targetType,
  targetId,
  setNotifications
}: CreateNotificationParams) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      target_type: targetType || null,
      target_id: targetId || null,
      is_read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  
  const newNotification: Notification = {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    message: data.message,
    type: data.type as Notification['type'],
    isRead: data.is_read,
    timestamp: data.created_at,
    targetId: data.target_id || undefined,
    targetType: data.target_type || undefined
  };
  
  setNotifications(prev => [newNotification, ...prev]);
  
  return newNotification;
};

// Helper for workflow services that create notifications for other users
export const createDbNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  targetId?: string,
  targetType?: string
) => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      target_id: targetId || null,
      target_type: targetType || null,
      is_read: false
    });
  
  if (error) {
    console.error('Error creating db notification:', error);
  }
};

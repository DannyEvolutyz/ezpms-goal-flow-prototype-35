
import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalBank, Notification, GoalSpace, Milestone } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useGoalStorage = () => {
  const { user } = useAuth();
  const [goalBank, setGoalBank] = useState<GoalBank[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [spaces, setSpaces] = useState<GoalSpace[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch goal spaces from database
  const fetchSpaces = useCallback(async () => {
    const { data, error } = await supabase
      .from('goal_spaces')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching goal spaces:', error);
      return;
    }
    
    const mapped: GoalSpace[] = (data || []).map(s => ({
      id: s.id,
      name: s.name,
      description: s.description || '',
      startDate: s.start_date,
      submissionDeadline: s.submission_deadline,
      reviewDeadline: s.review_deadline,
      createdAt: s.created_at,
      isActive: s.is_active
    }));
    setSpaces(mapped);
  }, []);

  // Fetch goals from database
  const fetchGoals = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('goals')
      .select('*');
    
    if (error) {
      console.error('Error fetching goals:', error);
      return;
    }
    
    // Fetch milestones for all goals
    const goalIds = (data || []).map(g => g.id);
    let milestonesMap: Record<string, Milestone[]> = {};
    
    if (goalIds.length > 0) {
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .in('goal_id', goalIds);
      
      (milestonesData || []).forEach(m => {
        if (!milestonesMap[m.goal_id]) milestonesMap[m.goal_id] = [];
        milestonesMap[m.goal_id].push({
          id: m.id,
          title: m.title,
          description: m.description || undefined,
          completed: m.completed,
          completionComment: m.completion_comment || undefined,
          targetDate: m.target_date || undefined
        });
      });
    }
    
    const mapped: Goal[] = (data || []).map(g => ({
      id: g.id,
      userId: g.user_id,
      spaceId: g.space_id,
      title: g.title,
      description: g.description,
      category: g.category,
      priority: g.priority as Goal['priority'],
      targetDate: g.target_date,
      status: g.status as Goal['status'],
      feedback: g.feedback || '',
      reviewerId: g.reviewer_id || undefined,
      weightage: g.weightage,
      rating: g.rating || undefined,
      ratingComment: g.rating_comment || undefined,
      createdAt: g.created_at,
      updatedAt: g.updated_at,
      milestones: milestonesMap[g.id] || []
    }));
    setGoals(mapped);
  }, [user]);

  // Fetch goal bank from database
  const fetchGoalBank = useCallback(async () => {
    const { data, error } = await supabase
      .from('goal_bank')
      .select('*');
    
    if (error) {
      console.error('Error fetching goal bank:', error);
      return;
    }
    
    // Fetch milestones
    const bankIds = (data || []).map(g => g.id);
    let milestonesMap: Record<string, Milestone[]> = {};
    
    if (bankIds.length > 0) {
      const { data: milestonesData } = await supabase
        .from('goal_bank_milestones')
        .select('*')
        .in('goal_bank_id', bankIds);
      
      (milestonesData || []).forEach(m => {
        if (!milestonesMap[m.goal_bank_id]) milestonesMap[m.goal_bank_id] = [];
        milestonesMap[m.goal_bank_id].push({
          id: m.id,
          title: m.title,
          description: m.description || undefined,
          completed: false
        });
      });
    }
    
    // Fetch space associations
    const { data: spacesData } = await supabase
      .from('goal_bank_spaces')
      .select('*');
    
    const spaceMap: Record<string, string[]> = {};
    (spacesData || []).forEach(s => {
      if (!spaceMap[s.goal_bank_id]) spaceMap[s.goal_bank_id] = [];
      spaceMap[s.goal_bank_id].push(s.goal_space_id);
    });
    
    const mapped: GoalBank[] = (data || []).map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      category: g.category,
      targetAudience: g.target_audience,
      createdBy: g.created_by || '',
      isActive: g.is_active,
      milestones: milestonesMap[g.id] || [],
      spaceIds: spaceMap[g.id] || []
    }));
    setGoalBank(mapped);
  }, []);

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }
    
    const mapped: Notification[] = (data || []).map(n => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type as Notification['type'],
      isRead: n.is_read,
      timestamp: n.created_at,
      ...(n.target_id ? { targetId: n.target_id } : {}),
      ...(n.target_type ? { targetType: n.target_type } : {})
    }));
    setNotifications(mapped);
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user && !isInitialized) {
      Promise.all([fetchSpaces(), fetchGoals(), fetchGoalBank(), fetchNotifications()])
        .then(() => setIsInitialized(true));
    } else if (!user) {
      setIsInitialized(false);
      setGoals([]);
      setNotifications([]);
    }
  }, [user, isInitialized, fetchSpaces, fetchGoals, fetchGoalBank, fetchNotifications]);

  // Expose refetch functions so mutations can trigger refreshes
  return {
    goals,
    setGoals,
    notifications,
    setNotifications,
    goalBank,
    setGoalBank,
    spaces,
    setSpaces,
    refetchGoals: fetchGoals,
    refetchSpaces: fetchSpaces,
    refetchGoalBank: fetchGoalBank,
    refetchNotifications: fetchNotifications
  };
};

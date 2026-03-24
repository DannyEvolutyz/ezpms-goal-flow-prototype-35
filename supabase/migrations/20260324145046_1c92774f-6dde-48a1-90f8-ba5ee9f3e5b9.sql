
-- Allow authenticated users to insert notifications for any user (needed for workflow notifications)
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated can insert notifications" ON public.notifications 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Allow admins to delete goal spaces
CREATE POLICY "Admins can delete goal spaces" ON public.goal_spaces 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete goal bank items
CREATE POLICY "Admins can delete goal bank" ON public.goal_bank 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete goal bank milestones
CREATE POLICY "Admins can delete goal bank milestones" ON public.goal_bank_milestones 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete goal bank spaces
CREATE POLICY "Admins can delete goal bank spaces" ON public.goal_bank_spaces 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow managers to update milestones for team members' goals  
CREATE POLICY "Managers can update team milestones" ON public.milestones 
  FOR UPDATE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM goals g JOIN profiles p ON p.id = g.user_id 
    WHERE g.id = milestones.goal_id AND p.manager_id = auth.uid()
  ));

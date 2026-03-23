
-- Fix permissive INSERT policy on notifications - restrict to inserting for own user or via service role
DROP POLICY "System can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());


-- Junction table linking goal bank items to goal spaces
CREATE TABLE public.goal_bank_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_bank_id UUID REFERENCES public.goal_bank(id) ON DELETE CASCADE NOT NULL,
  goal_space_id UUID REFERENCES public.goal_spaces(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (goal_bank_id, goal_space_id)
);

ALTER TABLE public.goal_bank_spaces ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view (need to see tagged templates)
CREATE POLICY "Authenticated can view goal bank spaces" ON public.goal_bank_spaces FOR SELECT TO authenticated USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage goal bank spaces" ON public.goal_bank_spaces FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'member');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_url TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create goal_spaces table
CREATE TABLE public.goal_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  submission_deadline TIMESTAMPTZ NOT NULL,
  review_deadline TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  space_id UUID REFERENCES public.goal_spaces(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  target_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'submitted', 'under_review', 'final_approved')),
  feedback TEXT,
  reviewer_id UUID REFERENCES auth.users(id),
  weightage INTEGER NOT NULL DEFAULT 0,
  rating INTEGER,
  rating_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_comment TEXT,
  target_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goal_bank table
CREATE TABLE public.goal_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  target_audience TEXT NOT NULL DEFAULT 'All',
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goal_bank_milestones table
CREATE TABLE public.goal_bank_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_bank_id UUID REFERENCES public.goal_bank(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  target_id TEXT,
  target_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_bank_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- User roles RLS
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Goal spaces RLS (all authenticated can view, admins can manage)
CREATE POLICY "Authenticated can view goal spaces" ON public.goal_spaces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage goal spaces" ON public.goal_spaces FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Goals RLS
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Managers can view team goals" ON public.goals FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = goals.user_id AND profiles.manager_id = auth.uid())
);
CREATE POLICY "Admins can view all goals" ON public.goals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Managers can update team goals" ON public.goals FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = goals.user_id AND profiles.manager_id = auth.uid())
);
CREATE POLICY "Users can delete own draft goals" ON public.goals FOR DELETE TO authenticated USING (user_id = auth.uid() AND status = 'draft');

-- Milestones RLS
CREATE POLICY "Users can view own milestones" ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid())
);
CREATE POLICY "Managers can view team milestones" ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.goals g JOIN public.profiles p ON p.id = g.user_id WHERE g.id = milestones.goal_id AND p.manager_id = auth.uid())
);
CREATE POLICY "Admins can view all milestones" ON public.milestones FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can manage own milestones" ON public.milestones FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid())
);

-- Goal bank RLS (all authenticated can view, admins can manage)
CREATE POLICY "Authenticated can view goal bank" ON public.goal_bank FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage goal bank" ON public.goal_bank FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Goal bank milestones RLS
CREATE POLICY "Authenticated can view goal bank milestones" ON public.goal_bank_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage goal bank milestones" ON public.goal_bank_milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Notifications RLS
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

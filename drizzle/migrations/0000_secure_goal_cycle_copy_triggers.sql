ALTER FUNCTION public.backfill_cycle_goals() SECURITY DEFINER;
ALTER FUNCTION public.backfill_cycle_goals() SET search_path = public;
ALTER FUNCTION public.propagate_goal_to_cycles() SECURITY DEFINER;
ALTER FUNCTION public.propagate_goal_to_cycles() SET search_path = public;

REVOKE ALL ON FUNCTION public.backfill_cycle_goals() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.propagate_goal_to_cycles() FROM PUBLIC, anon, authenticated;
ALTER TABLE public.goal_spaces
  ADD COLUMN IF NOT EXISTS self_rating_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS self_rating_end_date timestamptz,
  ADD COLUMN IF NOT EXISTS manager_rating_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS manager_rating_end_date timestamptz;

UPDATE public.goal_spaces SET
  self_rating_start_date = rating_start_date,
  self_rating_end_date = rating_deadline,
  manager_rating_start_date = rating_start_date,
  manager_rating_end_date = rating_deadline
WHERE space_kind = 'cycle' AND self_rating_start_date IS NULL;

COMMENT ON COLUMN public.goal_spaces.edit_start_date IS 'DEPRECATED: cycles no longer have an edit window';
COMMENT ON COLUMN public.goal_spaces.edit_end_date IS 'DEPRECATED: cycles no longer have an edit window';
COMMENT ON COLUMN public.goal_spaces.rating_start_date IS 'DEPRECATED: replaced by self_rating_start_date / manager_rating_start_date';
COMMENT ON COLUMN public.goal_spaces.rating_deadline IS 'DEPRECATED: replaced by self_rating_end_date / manager_rating_end_date';

CREATE OR REPLACE FUNCTION public.validate_goal_space()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.space_kind NOT IN ('parent','goal_setting','cycle') THEN
    RAISE EXCEPTION 'Invalid space_kind: %', NEW.space_kind;
  END IF;

  IF NEW.space_kind = 'parent' THEN
    IF NEW.parent_id IS NOT NULL THEN RAISE EXCEPTION 'Parent spaces cannot have a parent_id'; END IF;
    IF NEW.start_date IS NOT NULL OR NEW.submission_deadline IS NOT NULL
       OR NEW.review_deadline IS NOT NULL OR NEW.self_rating_start_date IS NOT NULL
       OR NEW.manager_rating_start_date IS NOT NULL THEN
      RAISE EXCEPTION 'Parent spaces cannot have timeline dates';
    END IF;
  ELSIF NEW.space_kind = 'goal_setting' THEN
    IF NEW.parent_id IS NULL THEN RAISE EXCEPTION 'Goal Setting requires a parent'; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.goal_spaces WHERE id = NEW.parent_id AND space_kind = 'parent') THEN
      RAISE EXCEPTION 'Goal Setting must attach to a parent space';
    END IF;
    IF NEW.start_date IS NULL OR NEW.submission_deadline IS NULL OR NEW.review_deadline IS NULL THEN
      RAISE EXCEPTION 'Goal Setting requires start, submission, and review dates';
    END IF;
    IF NOT (NEW.start_date <= NEW.submission_deadline AND NEW.submission_deadline <= NEW.review_deadline) THEN
      RAISE EXCEPTION 'Goal Setting dates must be ordered';
    END IF;
    IF TG_OP = 'INSERT' AND EXISTS (
      SELECT 1 FROM public.goal_spaces WHERE parent_id = NEW.parent_id AND space_kind = 'goal_setting'
    ) THEN
      RAISE EXCEPTION 'Only one Goal Setting sub-space is allowed per parent';
    END IF;
  ELSIF NEW.space_kind = 'cycle' THEN
    IF NEW.parent_id IS NULL THEN RAISE EXCEPTION 'Cycle requires a parent'; END IF;
    IF NOT EXISTS (SELECT 1 FROM public.goal_spaces WHERE id = NEW.parent_id AND space_kind = 'parent') THEN
      RAISE EXCEPTION 'Cycle must attach to a parent space';
    END IF;
    IF NEW.self_rating_start_date IS NULL OR NEW.self_rating_end_date IS NULL
       OR NEW.manager_rating_start_date IS NULL OR NEW.manager_rating_end_date IS NULL THEN
      RAISE EXCEPTION 'Sub-space requires employee and manager rating dates';
    END IF;
    IF NEW.self_rating_start_date > NEW.self_rating_end_date THEN
      RAISE EXCEPTION 'Employee rating end must be on or after its start';
    END IF;
    IF NEW.manager_rating_start_date > NEW.manager_rating_end_date THEN
      RAISE EXCEPTION 'Manager rating end must be on or after its start';
    END IF;
    IF NEW.manager_rating_start_date < NEW.self_rating_start_date THEN
      RAISE EXCEPTION 'Manager rating cannot start before employee rating';
    END IF;
    IF NEW.manager_rating_end_date < NEW.self_rating_end_date THEN
      RAISE EXCEPTION 'Manager rating cannot end before employee rating';
    END IF;
    IF NEW.start_date IS NOT NULL OR NEW.submission_deadline IS NOT NULL OR NEW.review_deadline IS NOT NULL THEN
      RAISE EXCEPTION 'Cycle cannot have goal-setting dates';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enforce_rating_windows()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE s RECORD;
BEGIN
  IF NEW.self_rating IS NOT DISTINCT FROM OLD.self_rating
     AND NEW.rating IS NOT DISTINCT FROM OLD.rating THEN
    RETURN NEW;
  END IF;
  SELECT * INTO s FROM public.goal_spaces WHERE id = NEW.space_id;
  IF s.space_kind <> 'cycle' OR NOT s.is_active THEN
    RAISE EXCEPTION 'Goals can only be rated inside an active review sub-space';
  END IF;
  IF NEW.self_rating IS DISTINCT FROM OLD.self_rating THEN
    IF s.self_rating_start_date IS NULL OR now() < s.self_rating_start_date
       OR now() >= s.self_rating_end_date + interval '1 day' THEN
      RAISE EXCEPTION 'Self-rating is only allowed during the employee rating window';
    END IF;
  END IF;
  IF NEW.rating IS DISTINCT FROM OLD.rating THEN
    IF NEW.self_rated_at IS NULL OR NEW.self_rating IS NULL THEN
      RAISE EXCEPTION 'The member must self-rate this goal before the manager can rate it';
    END IF;
    IF s.manager_rating_start_date IS NULL OR now() < s.manager_rating_start_date
       OR now() >= s.manager_rating_end_date + interval '1 day' THEN
      RAISE EXCEPTION 'Manager rating is only allowed during the manager rating window';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.enforce_rating_windows() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_rating_windows_trg ON public.goals;
CREATE TRIGGER enforce_rating_windows_trg BEFORE UPDATE ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.enforce_rating_windows();
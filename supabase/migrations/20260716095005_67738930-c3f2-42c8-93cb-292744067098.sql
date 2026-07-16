
-- DESTRUCTIVE: wipe existing goals and goal spaces per plan
DELETE FROM public.notifications;
DELETE FROM public.milestones;
DELETE FROM public.goals;
DELETE FROM public.goal_bank_spaces;
DELETE FROM public.goal_spaces;

DROP TRIGGER IF EXISTS validate_goal_space_trigger ON public.goal_spaces;
DROP TRIGGER IF EXISTS validate_goal_space_ref_trigger ON public.goals;

ALTER TABLE public.goal_spaces
  ADD COLUMN IF NOT EXISTS space_kind text NOT NULL DEFAULT 'cycle',
  ADD COLUMN IF NOT EXISTS edit_start_date date,
  ADD COLUMN IF NOT EXISTS edit_end_date date;

ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS source_goal_id uuid REFERENCES public.goals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS origin_space_id uuid REFERENCES public.goal_spaces(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.validate_goal_space()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.space_kind NOT IN ('parent','goal_setting','cycle') THEN
    RAISE EXCEPTION 'Invalid space_kind: %', NEW.space_kind;
  END IF;

  IF NEW.space_kind = 'parent' THEN
    IF NEW.parent_id IS NOT NULL THEN RAISE EXCEPTION 'Parent spaces cannot have a parent_id'; END IF;
    IF NEW.start_date IS NOT NULL OR NEW.submission_deadline IS NOT NULL
       OR NEW.review_deadline IS NOT NULL OR NEW.rating_start_date IS NOT NULL
       OR NEW.rating_deadline IS NOT NULL OR NEW.edit_start_date IS NOT NULL
       OR NEW.edit_end_date IS NOT NULL THEN
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
    IF NEW.rating_start_date IS NOT NULL OR NEW.rating_deadline IS NOT NULL
       OR NEW.edit_start_date IS NOT NULL OR NEW.edit_end_date IS NOT NULL THEN
      RAISE EXCEPTION 'Goal Setting cannot have edit or rating dates';
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
    IF NEW.edit_start_date IS NULL OR NEW.edit_end_date IS NULL
       OR NEW.rating_start_date IS NULL OR NEW.rating_deadline IS NULL THEN
      RAISE EXCEPTION 'Cycle requires edit and rating dates';
    END IF;
    IF NOT (NEW.edit_start_date <= NEW.edit_end_date
       AND NEW.edit_end_date <= NEW.rating_start_date
       AND NEW.rating_start_date <= NEW.rating_deadline) THEN
      RAISE EXCEPTION 'Cycle dates must be ordered';
    END IF;
    IF NEW.start_date IS NOT NULL OR NEW.submission_deadline IS NOT NULL OR NEW.review_deadline IS NOT NULL THEN
      RAISE EXCEPTION 'Cycle cannot have goal-setting dates';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_goal_space_trigger
BEFORE INSERT OR UPDATE ON public.goal_spaces
FOR EACH ROW EXECUTE FUNCTION public.validate_goal_space();

CREATE OR REPLACE FUNCTION public.validate_goal_space_ref()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.goal_spaces
    WHERE id = NEW.space_id AND space_kind IN ('goal_setting','cycle')
  ) THEN
    RAISE EXCEPTION 'Goals must belong to a Goal Setting or cycle sub-space';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_goal_space_ref_trigger
BEFORE INSERT OR UPDATE ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.validate_goal_space_ref();

CREATE OR REPLACE FUNCTION public.propagate_goal_to_cycles()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE
  parent_uuid uuid; origin_kind text; cyc RECORD; new_goal_id uuid;
BEGIN
  SELECT parent_id, space_kind INTO parent_uuid, origin_kind
    FROM public.goal_spaces WHERE id = NEW.space_id;
  IF origin_kind <> 'goal_setting' THEN RETURN NEW; END IF;
  IF NEW.status <> 'final_approved' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'final_approved' THEN RETURN NEW; END IF;

  FOR cyc IN SELECT id FROM public.goal_spaces WHERE parent_id = parent_uuid AND space_kind = 'cycle' LOOP
    IF EXISTS (SELECT 1 FROM public.goals WHERE source_goal_id = NEW.id AND space_id = cyc.id) THEN
      CONTINUE;
    END IF;
    INSERT INTO public.goals (
      user_id, title, description, category, priority, weightage, target_date,
      status, space_id, source_goal_id, origin_space_id
    ) VALUES (
      NEW.user_id, NEW.title, NEW.description, NEW.category, NEW.priority,
      NEW.weightage, NEW.target_date, 'approved', cyc.id, NEW.id, NEW.space_id
    ) RETURNING id INTO new_goal_id;

    INSERT INTO public.milestones (goal_id, title, description, target_date, completed, completion_comment)
    SELECT new_goal_id, title, description, target_date, false, NULL
    FROM public.milestones WHERE goal_id = NEW.id;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS propagate_goal_to_cycles_trigger ON public.goals;
CREATE TRIGGER propagate_goal_to_cycles_trigger
AFTER INSERT OR UPDATE OF status ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.propagate_goal_to_cycles();

CREATE OR REPLACE FUNCTION public.backfill_cycle_goals()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE
  gs_id uuid; src RECORD; new_goal_id uuid;
BEGIN
  IF NEW.space_kind <> 'cycle' THEN RETURN NEW; END IF;
  SELECT id INTO gs_id FROM public.goal_spaces
    WHERE parent_id = NEW.parent_id AND space_kind = 'goal_setting';
  IF gs_id IS NULL THEN RETURN NEW; END IF;

  FOR src IN SELECT * FROM public.goals WHERE space_id = gs_id AND status = 'final_approved' LOOP
    INSERT INTO public.goals (
      user_id, title, description, category, priority, weightage, target_date,
      status, space_id, source_goal_id, origin_space_id
    ) VALUES (
      src.user_id, src.title, src.description, src.category, src.priority,
      src.weightage, src.target_date, 'approved', NEW.id, src.id, gs_id
    ) RETURNING id INTO new_goal_id;

    INSERT INTO public.milestones (goal_id, title, description, target_date, completed, completion_comment)
    SELECT new_goal_id, title, description, target_date, false, NULL
    FROM public.milestones WHERE goal_id = src.id;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS backfill_cycle_goals_trigger ON public.goal_spaces;
CREATE TRIGGER backfill_cycle_goals_trigger
AFTER INSERT ON public.goal_spaces
FOR EACH ROW EXECUTE FUNCTION public.backfill_cycle_goals();

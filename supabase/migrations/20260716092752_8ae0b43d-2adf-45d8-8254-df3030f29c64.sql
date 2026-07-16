
-- Add parent/sub-space hierarchy and rating phase to goal_spaces
ALTER TABLE public.goal_spaces
  ADD COLUMN parent_id uuid REFERENCES public.goal_spaces(id) ON DELETE CASCADE,
  ADD COLUMN rating_start_date timestamptz,
  ADD COLUMN rating_deadline timestamptz;

ALTER TABLE public.goal_spaces
  ALTER COLUMN start_date DROP NOT NULL,
  ALTER COLUMN submission_deadline DROP NOT NULL,
  ALTER COLUMN review_deadline DROP NOT NULL;

-- Backfill: create a "Legacy Goals" parent and re-parent all existing spaces
DO $$
DECLARE
  legacy_id uuid;
  has_existing boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.goal_spaces) INTO has_existing;
  IF has_existing THEN
    INSERT INTO public.goal_spaces (name, description, is_active, start_date, submission_deadline, review_deadline)
    VALUES ('Legacy Goals', 'Container for pre-existing goal spaces', true, NULL, NULL, NULL)
    RETURNING id INTO legacy_id;

    UPDATE public.goal_spaces
    SET parent_id = legacy_id,
        rating_start_date = review_deadline + interval '1 day',
        rating_deadline = review_deadline + interval '14 days'
    WHERE id <> legacy_id AND parent_id IS NULL;
  END IF;
END $$;

-- Validation trigger for goal_spaces
CREATE OR REPLACE FUNCTION public.validate_goal_space()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    -- Parent space: no timeline fields allowed
    IF NEW.start_date IS NOT NULL OR NEW.submission_deadline IS NOT NULL
       OR NEW.review_deadline IS NOT NULL OR NEW.rating_start_date IS NOT NULL
       OR NEW.rating_deadline IS NOT NULL THEN
      RAISE EXCEPTION 'Parent goal spaces cannot have timeline dates';
    END IF;
  ELSE
    -- Sub-space: parent must itself be a parent (no nesting deeper than 1)
    IF EXISTS (SELECT 1 FROM public.goal_spaces WHERE id = NEW.parent_id AND parent_id IS NOT NULL) THEN
      RAISE EXCEPTION 'Sub-spaces cannot be nested under another sub-space';
    END IF;
    IF NEW.start_date IS NULL OR NEW.submission_deadline IS NULL
       OR NEW.review_deadline IS NULL OR NEW.rating_start_date IS NULL
       OR NEW.rating_deadline IS NULL THEN
      RAISE EXCEPTION 'Sub-spaces require all timeline dates';
    END IF;
    IF NOT (NEW.start_date <= NEW.submission_deadline
       AND NEW.submission_deadline <= NEW.review_deadline
       AND NEW.review_deadline <= NEW.rating_start_date
       AND NEW.rating_start_date <= NEW.rating_deadline) THEN
      RAISE EXCEPTION 'Timeline dates must be in order: start <= submission <= review <= rating start <= rating deadline';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_goal_space_trg ON public.goal_spaces;
CREATE TRIGGER validate_goal_space_trg
BEFORE INSERT OR UPDATE ON public.goal_spaces
FOR EACH ROW EXECUTE FUNCTION public.validate_goal_space();

-- Goals must live inside a sub-space
CREATE OR REPLACE FUNCTION public.validate_goal_space_ref()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.goal_spaces WHERE id = NEW.space_id AND parent_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Goals must belong to a sub-space, not a parent goal space';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_goal_space_ref_trg ON public.goals;
CREATE TRIGGER validate_goal_space_ref_trg
BEFORE INSERT OR UPDATE OF space_id ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.validate_goal_space_ref();

-- Rating fields on goals
ALTER TABLE public.goals
  ADD COLUMN self_rating integer,
  ADD COLUMN self_rating_comment text,
  ADD COLUMN self_rated_at timestamptz,
  ADD COLUMN manager_rated_at timestamptz;

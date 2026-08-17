CREATE OR REPLACE FUNCTION public.propagate_goal_to_cycles()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $function$
DECLARE
  parent_uuid uuid; origin_kind text; cyc RECORD; new_goal_id uuid;
BEGIN
  SELECT parent_id, space_kind INTO parent_uuid, origin_kind
    FROM public.goal_spaces WHERE id = NEW.space_id;
  IF origin_kind <> 'goal_setting' THEN RETURN NEW; END IF;
  IF NEW.status NOT IN ('approved','final_approved') THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status IN ('approved','final_approved') THEN RETURN NEW; END IF;

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
$function$;

CREATE OR REPLACE FUNCTION public.backfill_cycle_goals()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $function$
DECLARE
  gs_id uuid; src RECORD; new_goal_id uuid;
BEGIN
  IF NEW.space_kind <> 'cycle' THEN RETURN NEW; END IF;
  SELECT id INTO gs_id FROM public.goal_spaces
    WHERE parent_id = NEW.parent_id AND space_kind = 'goal_setting';
  IF gs_id IS NULL THEN RETURN NEW; END IF;

  FOR src IN SELECT * FROM public.goals WHERE space_id = gs_id AND status IN ('approved','final_approved') LOOP
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
$function$;

DROP TRIGGER IF EXISTS validate_goal_space_trigger ON public.goal_spaces;
DROP TRIGGER IF EXISTS validate_goal_space_ref_trigger ON public.goals;

-- one-time backfill of already-approved goal setting goals into existing cycles
INSERT INTO public.goals (user_id, title, description, category, priority, weightage, target_date, status, space_id, source_goal_id, origin_space_id)
SELECT g.user_id, g.title, g.description, g.category, g.priority, g.weightage, g.target_date, 'approved', c.id, g.id, g.space_id
FROM public.goals g
JOIN public.goal_spaces gs ON gs.id = g.space_id AND gs.space_kind = 'goal_setting'
JOIN public.goal_spaces c ON c.parent_id = gs.parent_id AND c.space_kind = 'cycle'
WHERE g.status IN ('approved','final_approved')
  AND NOT EXISTS (SELECT 1 FROM public.goals x WHERE x.source_goal_id = g.id AND x.space_id = c.id);
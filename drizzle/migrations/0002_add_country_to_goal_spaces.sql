ALTER TABLE public.goal_spaces ADD COLUMN country text NOT NULL DEFAULT 'IN';
ALTER TABLE public.goal_spaces ADD CONSTRAINT goal_spaces_country_check CHECK (country IN ('IN','US'));
COMMENT ON COLUMN public.goal_spaces.country IS 'Country tag for the goal space: IN (India) or US (United States). Sub-spaces inherit the parent space country.';
# Goal Spaces: Parent Spaces, Sub-Spaces & Rating Phase

## Overview

Rework Goal Spaces into a two-level hierarchy and add a new **Rating** phase to the timeline.

- **Parent Goal Space** (e.g., "2027 Goals"): container only. No timeline. No goals created directly on it.
- **Sub-Space** (e.g., "Q1 2027", "H1 2027"): belongs to a parent, has all the timeline settings. Goals are always created inside a sub-space.
- **New Rating phase**: sequential after Review Deadline. Member self-rates first, then their manager rates.

## Data Model Changes

`goal_spaces` table:
- Add `parent_id uuid` (nullable, FK → `goal_spaces.id`, ON DELETE CASCADE). NULL = parent space.
- Add `rating_start_date date` (nullable, required for sub-spaces).
- Add `rating_deadline date` (nullable, required for sub-spaces).
- Timeline columns (`start_date`, `submission_deadline`, `review_deadline`) become nullable so parent spaces can skip them.
- Constraint (via trigger): parents must have all timeline fields NULL; sub-spaces must have all timeline fields set with ordering `start ≤ submission ≤ review ≤ rating_start ≤ rating_deadline`. Only one level of nesting (a space with `parent_id` cannot itself be a parent to others).

`goals` table:
- `space_id` must reference a sub-space only (enforced via trigger).

`goals` rating fields (already partly present — `rating`, `rating_comment`):
- Add `self_rating numeric`, `self_rating_comment text`, `self_rated_at timestamptz`.
- Add `manager_rated_at timestamptz`.
- Manager rating only allowed after `self_rated_at` is set and current date is within the sub-space's rating window.

## Admin UI (`GoalSpaceManager`)

- List becomes a two-level tree: parent spaces expand to show their sub-spaces.
- "Create Goal Space" opens a simplified form: **name + description only** (no dates).
- Each parent row has "+ Add Sub-Space". Sub-space form matches today's space form **plus** the new Rating Start / Rating Deadline pickers. Validation enforces the ordering above.
- Edit/delete supported on both levels. Deleting a parent cascades to its sub-spaces (with confirm).

## Space Selector (goal creation, manager review, dashboards)

- `GoalSpaceSelector` and `ManagerGoalSpaceSelector` show a grouped dropdown: parent name as a non-selectable heading, sub-spaces indented beneath it. Only sub-spaces are selectable.
- `getAvailableSpaces`, `getSpacesForReview`, `getActiveSpace` filter to sub-spaces only.

## Rating Workflow

- New phase gate `canRateGoals(spaceId)`: today is between `rating_start_date` and `rating_deadline` of the sub-space.
- Member view: on their approved/final-approved goals, during the rating window, show "Self-Rate" action (rating + comment). Locks after submit.
- Manager view: new "Rate Goals" section shows their team's goals where `self_rated_at IS NOT NULL` and rating window is open. Manager submits rating + comment. If self-rating missing, manager sees a disabled state with "Waiting for self-rating".
- Notifications: notify manager when a member self-rates; notify member when their manager rates.

## Timeline Order

```text
Start Date ─► Submission Deadline ─► Review Deadline ─► Rating Start ─► Rating Deadline
 create/edit        (locks edits)     (managers review)   (self-rate)     (manager rates)
```

## Files to Touch

- Migration: `goal_spaces` + `goals` schema + validation triggers + RLS updates.
- `src/types/goal-space.ts`, `src/types/goal.ts` — new fields.
- `src/contexts/goal/services/goalSpaces.ts` — parent/sub logic, new queries (`getParentSpaces`, `getSubSpaces(parentId)`, `getSpacesForRating`, `canRateGoals`).
- `src/contexts/goal/hooks/useGoalSpaces.tsx`, `useGoalStorage.ts`, `types.ts` — expose new API.
- `src/components/admin/GoalSpaceManager.tsx` — tree UI + parent/sub forms.
- `src/components/goals/GoalSpaceSelector.tsx`, `src/components/manager/ManagerGoalSpaceSelector.tsx` — grouped dropdown.
- `src/components/goals/GoalFormComponent.tsx` — default to first available sub-space.
- New: `src/components/goals/GoalSelfRating.tsx`, `src/components/manager/RateGoalsTab.tsx` (already exists — wire up to new gating and self-rating dependency).
- `src/contexts/goal/services/goalWorkflow.ts` — `submitSelfRating`, `submitManagerRating` guarded by phase + sequence.

## Migration Plan for Existing Data

Existing `goal_spaces` rows are treated as sub-spaces without a parent. The migration creates a default parent "Legacy Goals" and sets every existing space's `parent_id` to it, then backfills `rating_start_date` = `review_deadline + 1 day` and `rating_deadline` = `review_deadline + 14 days` so no space is stuck without a rating window. Existing goals keep their `space_id` unchanged.

## Out of Scope

- Deeper nesting (sub-sub-spaces).
- Bulk rating, rating templates, rating scales beyond what already exists on `goals`.
- Changing existing approval/review workflow other than adding the rating phase after it.

# Separate employee and manager rating windows for sub-spaces

Remove the "Edit start & end date" fields from sub-spaces. Replace the single rating window with two windows: one for employees, one for managers. Members always rate first.

## What the admin sees when creating or editing a sub-space

- Name, description (unchanged)
- Employee rating start date / Employee rating end date
- Manager rating start date / Manager rating end date
- Active toggle (edit only)

Date rules, checked in the form with inline messages:
- Employee start on or before employee end
- Manager start on or before manager end
- Manager start on or after employee start
- Manager end on or after employee end

Manager dates may overlap the employee window, so managers can start on goals as soon as each member has self-rated.

## Rating rules (hard rules)

1. A member can self-rate only during the employee rating window.
2. A manager can rate a goal only during the manager rating window **and** only after the member has self-rated that goal. No exceptions.
3. Goal Setting stays view-only for rating (unchanged).

## Status labels on sub-spaces

Upcoming, Self-rating open, Manager rating open, Completed. They replace the old Editing / Awaiting Rating labels. Member and manager screens show the dates for their own window, and explain why rating is locked (for example "Self-rating opens 1 Oct" or "Waiting for member's self-rating").

## Existing sub-spaces

Current sub-spaces get their existing rating dates copied into both windows, so nothing breaks. Admins can then adjust them with Edit.

## Side effect to note

Without edit dates, goal copies inside sub-spaces no longer have a separate "update progress" period. They stay read-only apart from rating. Tell me if you want progress edits kept open during the employee window.

## Technical section

- Migration: add `self_rating_start_date`, `self_rating_end_date`, `manager_rating_start_date`, `manager_rating_end_date` (timestamptz, nullable) to `goal_spaces`; backfill from `rating_start_date` / `rating_deadline`. Rewrite `validate_goal_space` so cycles require the four new dates with the ordering above and no longer require edit dates. Mark `edit_start_date`, `edit_end_date`, `rating_start_date`, `rating_deadline` as deprecated via COMMENT (not dropped).
- Server-side guard: BEFORE UPDATE trigger on `goals` rejecting `self_rating` changes outside the employee window, and `rating` changes outside the manager window or when `self_rated_at` is null.
- Types/services: extend `GoalSpace` and mappers in `useGoalStorage.ts` / `goalSpaces.ts`; replace `canRateGoals` with `canSelfRate(spaceId)` and `canManagerRate(spaceId)`; `canEditCycleGoal` returns false.
- UI: update `GoalSpaceManager.tsx` create form and `EditSpaceDialog.tsx`; `GoalCard.tsx` / `SelfRatingDialog.tsx` use `canSelfRate`; `GoalReviewPanel.tsx` uses `canManagerRate` + self-rated check; phase logic in `Goals.tsx` and the admin tree badges use the new windows.

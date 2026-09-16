# Edit option for Goal Spaces

Add an "Edit" action next to the existing delete action in Admin → Goal Spaces, so a space's name, description, dates and active state can be changed in place.

## Where the edit button appears

- **Parent space row** (e.g. "2026 Goals") — pencil button beside "Add Sub-Space" and delete.
- **Goal Setting row** — pencil button (this row currently has no actions at all, since it can't be deleted).
- **Cycle rows** (e.g. "Half yearly 2026") — pencil button beside delete.

## What each edit form contains

| Space type | Editable fields |
|---|---|
| Parent | Name, description, active toggle |
| Goal Setting | Name, description, start date, submission deadline, review deadline, active toggle |
| Cycle | Name, description, edit start, edit end, rating start, rating deadline, active toggle |

Dates keep the same ordering rules used when creating:
- Goal Setting: start ≤ submission ≤ review
- Cycle: edit start ≤ edit end ≤ rating start ≤ rating deadline

Invalid ordering shows an inline message on the offending field and the save is blocked before it reaches the database.

## Behaviour notes

- The form opens pre-filled with the space's current values.
- Turning a space inactive makes it read-only for members and hides it from the open-for-goal-setting lists; it is not deleted.
- Changing dates immediately changes which phase a space is in (Upcoming / Goal Setting / Review, or Editing / Rating / Completed) — the phase badge updates as soon as the change saves.
- Existing goals inside the space are untouched by an edit.

## Technical section

- New component `src/components/admin/goal-space/EditSpaceDialog.tsx`: one dialog that branches its field set on `space.spaceKind`, reusing the existing `DateField` helper (extracted from `GoalSpaceManager.tsx` into a shared file so both create and edit dialogs use it).
- Zod schemas per kind, mirroring the `parentSchema` / `cycleSchema` refinements already in `GoalSpaceManager.tsx`, plus a goal-setting schema with the start/submission/review refinements.
- Saves through the already-wired `updateGoalSpace(spaceId, partial)` from `useGoals()` → `updateGoalSpaceService` in `src/contexts/goal/services/goalSpaces.ts`, which maps camelCase fields to columns and refetches. Only changed fields are passed; dates sent as ISO strings.
- `GoalSpaceManager.tsx`: add `editingSpace` state, pencil buttons on the parent header and in `SubSpaceRow`, and render the dialog.
- The database `validate_goal_space` trigger still guards ordering server-side; if it rejects an update, the error surfaces as a destructive toast.

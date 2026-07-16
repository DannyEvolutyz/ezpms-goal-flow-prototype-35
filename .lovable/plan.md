
# Goal Spaces: Mandatory Goal Setting Sub-Space + Inherited Sub-Space Cycles

## Concept

Every parent Goal Space has exactly one **Goal Setting** sub-space (auto-created, non-deletable, non-renameable). All goals are authored there. Additional sub-spaces are **cycles** (e.g., Q1, Q2) that automatically receive an independent copy of every approved Goal Setting goal, and only expose an editing window and a rating window.

```text
Parent Space "2027 Goals"
├── Goal Setting  ← auto-created; start / submission / review dates
│    └── goals authored & approved here
├── Q1 2027       ← edit window + rating window; inherits copies
├── Q2 2027
└── ...
```

## Admin UI Changes (`GoalSpaceManager`)

- **Create Parent form** now collects: name, description, **Start Date**, **Submission Deadline**, **Review Deadline**. On submit, the parent row is created and a Goal Setting sub-space is created in the same transaction using those three dates.
- Goal Setting sub-space is rendered under the parent with a lock icon; edit is limited to its dates, delete is disabled.
- **Add Sub-Space form** (for cycles) collects: name, description, **Edit Start Date**, **Edit End Date**, **Rating Start Date**, **Rating End Date**. Ordering enforced: edit_start ≤ edit_end ≤ rating_start ≤ rating_end. Cycles cannot be created until the parent's Goal Setting review deadline has passed (admin override allowed).

## Data Model

`goal_spaces` table changes:
- Add `space_kind text` with values `'parent' | 'goal_setting' | 'cycle'`.
- Rename semantics of existing timeline columns:
  - `goal_setting` uses `start_date`, `submission_deadline`, `review_deadline` (rating cols NULL).
  - `cycle` uses new `edit_start_date`, `edit_end_date`, `rating_start_date`, `rating_deadline` (submission/review NULL).
- Add `source_goal_id uuid` on `goals` (nullable) pointing back to the original Goal Setting goal for traceability.
- Add `origin_space_id uuid` on `goals` (nullable) — the Goal Setting space it was copied from.
- Validation trigger rewritten to enforce the three kinds and their required date sets.
- Trigger on `goals`: when a goal reaches `final_approved` status in a Goal Setting space, insert an independent copy into every existing cycle sub-space of the same parent (status reset to `approved`, rating fields cleared, `source_goal_id` set). When a new cycle sub-space is created, backfill copies from its parent's Goal Setting approved goals.
- Each copy is fully independent: separate progress, self-rating, manager rating, edits.

## Service / Hook Changes

- `goalSpaces.ts`:
  - `createGoalSpace` accepts `kind` and the appropriate date set; parent creation returns both parent + auto-created goal-setting sub-space.
  - New selectors: `getGoalSettingSpace(parentId)`, `getCycleSpaces(parentId)`.
  - `canCreateOrEditGoals` → true only inside a `goal_setting` space, gated by its start/submission window.
  - `canEditCycleGoal(spaceId)` → true inside a `cycle` between edit_start/edit_end (limited-field edit).
  - `canRateGoals(spaceId)` → true inside a `cycle` between rating_start/rating_deadline; unchanged sequential rule (self then manager).
  - `getSpacesForReview` → returns only `goal_setting` spaces in review window.
  - `getSpacesForRating` → returns only `cycle` spaces in rating window.
- `useGoalSpaces` exposes the new selectors and kind info.

## Goal Creation & Rating Flow

- Goal creation form only lists Goal Setting sub-spaces in the selector.
- After a Goal Setting goal is `final_approved`, copies appear in each existing cycle for the parent.
- In a cycle, member sees the goal read-only outside the edit window; during the edit window they can adjust progress/notes (not title/weightage). During the rating window: self-rate first, then manager rates (existing logic).
- Manager review screen only surfaces Goal Setting goals awaiting approval; cycle sub-spaces surface goals awaiting manager rating.

## Migration Plan for Existing Data

Per user decision: wipe and re-setup.
- Migration deletes all existing rows in `goal_spaces` and `goals` (and cascades to `milestones`, `notifications` referencing them).
- Admins re-create parent spaces; Goal Setting is auto-created; cycles added as needed.
- One-shot destructive migration guarded by an explicit note in the migration description.

## Files to Touch

- Migration: `goal_spaces` schema (`space_kind`, new date cols), `goals` (`source_goal_id`, `origin_space_id`), triggers for validation + auto-copy, wipe existing data.
- `src/types/goal-space.ts`, `src/types/goal.ts` — new fields.
- `src/contexts/goal/services/goalSpaces.ts`, `hooks/useGoalSpaces.tsx`, `types.ts`, `GoalProviderImpl.tsx` — new API surface.
- `src/contexts/goal/hooks/useGoalStorage.ts` — map new columns.
- `src/components/admin/GoalSpaceManager.tsx` — parent form with dates, auto-created Goal Setting node, cycle form with edit/rating dates.
- `src/components/goals/GoalSpaceSelector.tsx`, `src/components/manager/ManagerGoalSpaceSelector.tsx` — filter by kind.
- `src/components/goals/GoalFormComponent.tsx` — only Goal Setting spaces available.
- `src/components/goals/goal-list/GoalCard.tsx` — cycle-context editing + existing self-rating.
- `src/components/manager/GoalReviewPanel.tsx`, `RateGoalsTab.tsx` — split review (Goal Setting) vs rating (cycles).

## Out of Scope

- Cross-cycle rating rollups or aggregate scoring.
- Editing the goal's core fields inside a cycle (title, weightage, milestones structure).
- Multi-parent inheritance or copying between unrelated parents.

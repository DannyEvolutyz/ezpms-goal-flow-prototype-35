## Goal: Members pick a Parent Space only

Today the create form and the "My Goals" view expose every sub-space (Goal Setting + each Cycle). Members should just pick the parent (e.g. "2026 Goals"); the app decides where the goal actually lives and keeps cycles in sync (propagation trigger already exists for `final_approved` goals).

---

### 1. Create New Goal — parent-only selector

File: `src/components/goals/GoalSpaceSelector.tsx`
- Replace the grouped sub-space dropdown with a flat list of **parent spaces** that have an open Goal Setting sub-space (i.e. `now <= submissionDeadline` of that Goal Setting child; admins bypass per existing rule).
- Show the parent name + the Goal Setting submission deadline as helper text.

File: `src/components/goals/GoalFormComponent.tsx` (+ `goalFormSchema` unchanged)
- Keep `spaceId` in the form, but before calling `addGoal`, resolve the selected parent → its `goal_setting` sub-space id and submit that. Helper lives in `useGoalSpaces` (new `getGoalSettingSpaceForParent(parentId)`).
- Default value = first eligible parent.

File: `src/contexts/goal/hooks/useGoalSpaces.tsx` + `services/goalSpaces.ts` + `contexts/goal/types.ts`
- Add `getGoalSettingSpaceForParent(parentId)` and `getParentSpacesOpenForCreation()` helpers. No DB changes; the existing `validate_goal_space_ref` trigger still passes because we submit the Goal Setting id.

---

### 2. "My Goals" view — parent-first, sub-space drill-down

File: `src/pages/Goals.tsx`
- Change the "Select Goal Space" dropdown to list **parent spaces only**.
- Below it, when a parent is selected, render a secondary tab strip: **Goal Setting** (default) + one tab per Cycle sub-space, each with its own deadline badge (`getSpaceDeadlineStatus` already handles both kinds).
- The goals list uses the active sub-space id for `getGoalsBySpace` and `isSpaceReadOnly`, so behaviour (edit rules, weightage, rating) stays identical.
- The `GoalBankComponent` block keeps using the parent id for template lookup (already parent-scoped).

---

### 3. Propagation & manual editing (already in place — no changes)

- Trigger `propagate_goal_to_cycles` clones each `final_approved` Goal Setting goal into every existing cycle.
- Trigger `backfill_cycle_goals` clones existing final-approved goals into a newly created cycle.
- Cycle copies are independent rows with `source_goal_id`, so members can manually edit them inside the cycle's edit window (`canEditCycleGoal`) without touching the Goal Setting original.

No migration required.

---

### Out of scope
- Admin `GoalSpaceManager` still shows the full tree (admin needs it).
- Manager review/rating selectors are unchanged (they operate per sub-space intentionally).
- No changes to the propagation triggers or `goals.space_id` constraint.

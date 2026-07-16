## Goal: Tag templates to Parent spaces only; surface them in the Goal Setting sub-space

Right now the "Tag to Goal Spaces" picker in Goal Bank Management lists every space (parents, Goal Setting, and Cycles). We'll restrict it to **parent spaces only**, and make template adoption resolve through the parent's Goal Setting sub-space so members see the tagged templates when creating goals.

### Changes

1. **`src/components/admin/GoalBankManager.tsx`**
   - Replace `getAllSpaces()` with `getParentSpaces()` when building the list passed to the form. Templates will only be taggable to parent spaces (e.g., "2026 Goals").
   - Existing `spaceIds` on a template continue to store parent space IDs.

2. **`src/components/admin/goal-bank/GoalBankForm.tsx`**
   - No structural change — it already renders whatever `spaces` prop it receives. Optional: update the helper text to "Tag to Parent Goal Spaces".

3. **`src/components/admin/goal-bank/GoalBankList.tsx`**
   - Ensure the space-name badges resolve against parent spaces (they already look up by id, so this keeps working once the tagged IDs are parent IDs).

4. **`src/components/goals/GoalBankComponent.tsx`** (template picker shown to members when creating a goal in a Goal Setting sub-space)
   - Today it filters templates by the exact `spaceId` the member is creating in. Since tags now live on the parent, resolve the parent of the current Goal Setting space and filter templates whose `spaceIds` includes that parent id.
   - Uses existing `spaces` from `useGoals()` to find `parentId` of the current space.

5. **Data migration (one-time, no schema change)**
   - Existing `goal_bank_spaces` rows may reference Goal Setting / Cycle sub-space IDs. Rewrite each such row to point at the sub-space's parent id, then de-duplicate. This ensures already-tagged templates continue to appear correctly under the new rule.
   - Executed via the insert tool (data-only update, no schema change).

### Out of scope
- No changes to the goals propagation triggers — goals set in Goal Setting already auto-clone into Cycle sub-spaces.
- No changes to the goal_spaces schema or the goals schema.

### Technical notes
- `getParentSpaces()` is already exposed on the goal context.
- `GoalBankComponent` receives `spaceId` (the Goal Setting sub-space the member is in); we'll look up `spaces.find(s => s.id === spaceId)?.parentId` and filter by that.
- Empty state copy in `GoalBankComponent` updates to reflect parent-level tagging.

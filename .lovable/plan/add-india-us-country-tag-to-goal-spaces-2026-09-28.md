# Add India / US country tag to Goal Spaces

## What you'll get

- When an admin creates a **parent Goal Space** (e.g. "2026 Goals"), a new **Country** dropdown appears with flag identifiers: 🇮🇳 India and 🇺🇸 United States.
- The chosen country is shown as a small flag badge next to the space name everywhere spaces are listed or picked:
  - Admin → Goal Spaces tree
  - Member "My Goals" parent-space picker
  - Manager goal-space dropdown and block cards
- Sub-spaces (Goal Setting, cycles) automatically inherit their parent space's country — no extra selection needed.
- The Edit dialog for a parent space also gets the country dropdown, so existing spaces can be re-tagged.

## Technical details

1. **Database migration** on `goal_spaces`:
   - Add `country text not null default 'IN'` with a check constraint limiting values to `'IN'` / `'US'`.
   - Existing spaces default to India (🇮🇳); admins can change them via Edit.
2. **Types** (`src/types/goal-space.ts`): add `country: 'IN' | 'US'` to `GoalSpace`, plus a `COUNTRIES` constant (`{ code, label, flag }`) for reuse.
3. **Service** (`src/contexts/goal/services/goalSpaces.ts`):
   - Map `country` in the row → `GoalSpace` mapper.
   - `createGoalSpace` accepts `country` for parent spaces; sub-space creation copies the parent's country.
   - `updateGoalSpace` allows changing `country` on a parent (optionally cascaded to its sub-spaces).
4. **Admin UI** (`GoalSpaceManager.tsx`, `EditSpaceDialog.tsx`):
   - Parent create form + edit dialog: country `Select` showing "🇮🇳 India" / "🇺🇸 United States".
   - Space tree rows show the flag next to the name.
5. **Selectors** (`GoalSpaceSelector.tsx`, `ManagerGoalSpaceSelector.tsx`): flag badge next to each parent space name in dropdowns and block cards.
6. **Validation**: Zod schema on the parent form requires a country; DB check constraint enforces it server-side.

## Out of scope

- No filtering of goals/users by country (tagging and display only).
- No additional countries beyond India and US (easy to extend later).

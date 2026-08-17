# Manager: navigate back between goal spaces

Right now, once a block inside a parent goal space is opened, there is no reliable way back to the parent list — the only control is a "Back to blocks" link, and switching parents in the dropdown is easy to miss.

## What changes

Add a clear two-level navigation bar at the top of the Manager Dashboard:

```text
All Goal Spaces  >  2026 Goals  >  Half Yearly Review
```

- **All Goal Spaces** — clickable; clears both the parent and the block, returning to a card grid of every parent goal space.
- **Parent name** — clickable; clears the block only and shows that parent's blocks again.
- **Current block** — plain text (you are here).

Other adjustments:
- The parent picker stays visible at all times (also when a block is open), and choosing a different parent immediately switches to that parent's block list.
- When no parent is selected, show parent goal spaces as clickable cards, so selection works by clicking as well as through the dropdown.
- Keep the block cards, timeline info, and the selected-space filtering behaviour exactly as they are today.

## Technical notes

- All edits are in `src/components/manager/ManagerGoalSpaceSelector.tsx`; `ManagerDashboard.tsx` keeps owning `selectedSpaceId`.
- Local `selectedParentId` state gets explicit reset handlers (`clearAll`, `clearBlock`) instead of relying solely on the sync effect, and the effect only back-fills the parent when a space is selected but no parent is known.
- Breadcrumb built with the existing shadcn `Breadcrumb` component if present, otherwise plain buttons — no new dependencies.

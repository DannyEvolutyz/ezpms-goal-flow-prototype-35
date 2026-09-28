# Show earlier sub-space ratings to managers and admins

When a manager or admin rates a goal in a sub-space, show that goal's ratings from the earlier sub-spaces in the same main space.

## What managers and admins see

In the Rate Goal panel, above the rating form, a new **"Previous ratings"** section lists each earlier sub-space in date order, for example:

```text
Previous ratings
  Q1 Review (1 Jan - 31 Mar)
    Member self-rating: 4/5  "comment"
    Manager rating:     3/5  "comment"
  Q2 Review (1 Apr - 30 Jun)
    Member self-rating: 4/5
    Manager rating:     Not rated yet
```

- Sub-space 1: no section (nothing came before it).
- Sub-space 2: shows sub-space 1's ratings.
- Sub-space 3: shows sub-spaces 1 and 2.
- Missing ratings show as "Not rated yet". The section is read-only.
- It appears wherever managers and admins open the Rate Goal panel (Manager portal and Admin Goal Review).

## Members

Members never see this section. Their goal cards and self-rating screen stay the same.

## Technical section

- "Earlier" means cycle sub-spaces under the same parent whose employee rating start date comes before the current one (use created date if tied).
- Match goals across cycles by the same `source_goal_id` (the original Goal Setting goal) and the same `user_id`.
- Add a helper `getPreviousCycleRatings(goal)` in the goal context, using the `goals` and `spaces` already loaded. Manager and admin access rules already let them read their team's or all goals, so no database change is needed.
- New component `PreviousRatingsSection.tsx`, rendered in `GoalReviewPanel.tsx` only for cycle goals when the user's role is manager or admin.

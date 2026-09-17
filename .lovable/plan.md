# Fix admin sub-space creation

## Confirmed cause

The signed-in account `admin@ezdanny.com` has the Admin role, and Admins have create/edit permission for goal spaces.

Creating a cycle sub-space also runs the automatic approved-goal copy process. That process currently runs with the signed-in user's normal goal permissions. When it copies another employee's approved goal into the new cycle, the database rejects the copied goal because users may only create their own goals. The app then incorrectly translates that secondary failure into an admin/session warning.

## Changes

1. Update the two automatic goal-copy processes to run as protected database operations, while preserving their existing trigger-only behavior and fixed database search path.
2. Keep goal-space creation Admin-only and keep normal employee goal permissions unchanged.
3. Improve error translation so a valid Admin is not told to sign in again when the failure comes from copying goals or milestones.
4. Verify both affected workflows:
   - An Admin can add a sub-space when the parent contains approved employee goals.
   - Approving a goal still copies it into all existing cycle sub-spaces.
5. Confirm copied goals and milestones retain the correct employee ownership and source links without duplicates.

## Technical notes

- Apply a database migration making `backfill_cycle_goals` and `propagate_goal_to_cycles` `SECURITY DEFINER` functions with `search_path = public`.
- Do not broaden client-facing insert policies on `goals` or `milestones`; the elevated access belongs only inside these controlled trigger functions.
- Adjust `friendlyError` in the goal-space service to reserve the administrator/session wording for actual goal-space authorization failures and provide an accurate copy failure message otherwise.

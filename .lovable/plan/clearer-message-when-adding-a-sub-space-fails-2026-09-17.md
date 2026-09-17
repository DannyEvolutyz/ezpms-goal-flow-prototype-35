# Clearer message when adding a sub-space fails

## What's happening

That message comes from the database's permission rules, not from a bug in the sub-space form. Only the admin account may create or change goal spaces, and the check is made against the signed-in session at the moment you press Save.

Checked against the live data: `admin@ezdanny.com` is the only account with admin rights, and it does have them. So the save was almost certainly made with an expired or lost sign-in session (you are currently sitting on the login screen) — with no valid session the database sees an anonymous visitor and refuses the row.

## What to change

Keep the admin-only rule exactly as it is. Only improve what you see when the save is refused:

1. Before saving a new or edited space, confirm there is still a valid signed-in session. If there isn't, show: "Your session has expired. Please sign in again to save this sub-space." instead of the raw database error.
2. If the session is valid but the account isn't an admin, show: "Only administrators can create or edit goal spaces."
3. Translate any remaining permission error from the database into the same plain wording, so the phrase "violates row-level security policy" never reaches the screen.
4. Remove the current silent failure: today a non-admin attempt just does nothing with no feedback at all. It will now always produce one of the messages above.

## Technical notes

- `src/contexts/goal/services/goalSpaces.ts`: in `createGoalSpace`, `updateGoalSpace` and `deleteGoalSpace`, replace the silent `return null` for non-admins with a thrown error carrying the admin-only wording; add a session check (`supabase.auth.getSession()`) that throws the session-expired wording when absent; map Postgres error code `42501` / messages containing `row-level security` to the friendly text.
- `src/components/admin/GoalSpaceManager.tsx` and `src/components/admin/goal-space/EditSpaceDialog.tsx`: surface those thrown messages through the existing destructive toast (already wired in the edit dialog; make sure the create/sub-space paths do the same).
- No database migration, no policy change.

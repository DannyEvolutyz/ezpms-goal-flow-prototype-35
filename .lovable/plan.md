## Plan: Remove Admin Team Toggle and Header Home Link

### Changes

1. **Dashboard page (`src/pages/Dashboard.tsx`)**
   - Remove the "Team Dashboard / Personal Dashboard" toggle for admin users.
   - Admins on `/dashboard` will always see the `PersonalDashboardView`.
   - Managers retain the toggle so they can still switch between Team and Personal views.
   - Clean up any now-unused toggle state/logic if it becomes unused after the admin branch is removed.

2. **Header navigation (`src/components/Header.tsx`)**
   - Remove the "Home" link from the main navigation menu for all users.
   - Remove "Home" from the mobile sheet menu as well (it uses the same `menuItems` array).
   - Keep Dashboard, Goals, Manager Dashboard, Admin Dashboard, and Organization links as they are.

### Verification
- Build/typecheck the project after edits.
- Confirm via preview that:
  - Admin `/dashboard` shows only Personal Dashboard with no toggle.
  - Manager `/dashboard` still shows the toggle.
  - Header no longer displays "Home" for any role.
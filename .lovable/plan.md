

# Supplier Admin Dashboard Improvements

## Changes

### 1. Auto-fill on Create User dialog (`StaffUserFormDialog.tsx`)
- Add an "Auto Fill" button that generates a random Thai name and email
- Pre-selects random modules from available list

### 2. Replace progress bar with simple number display (`SupplierAdminDashboard.tsx`)
- Remove the `Progress` bar component from the header card
- Show active user count as a simple bold number display (e.g., "Active Users: 3 / 20")
- Keep the limit-reached warning text

### 3. Add checkboxes to staff user listing (`SupplierAdminDashboard.tsx`)
- Add a checkbox column at the start of each row
- Add a "select all" checkbox in the header
- Track selected user IDs in state

### 4. Add bulk action toolbar (`SupplierAdminDashboard.tsx`)
- When one or more users are selected, show a toolbar above the table with:
  - **Reset Password** button -- calls reset on all selected users
  - **Set Active** button -- activates selected users (with headcount check)
  - **Set Inactive** button -- deactivates selected users
- Actions operate on all checked users at once via the hook
- Clear selection after action completes

### 5. Add `resetPassword` and `bulkSetStatus` to hook (`useSupplierStaff.ts`)
- `resetPassword(userIds: string[])` -- shows toast confirmation for each user
- `bulkSetStatus(userIds: string[], status)` -- sets active/inactive for multiple users with headcount validation

### 6. Remove per-row toggle/settings buttons
- Remove the individual toggle and settings icon buttons from each row's Actions column since bulk toolbar handles status changes
- Keep the module badge clickable for editing modules on individual users

## Files Modified

| File | Change |
|------|--------|
| `src/components/admin/StaffUserFormDialog.tsx` | Add auto-fill button |
| `src/components/npd/dashboards/SupplierAdminDashboard.tsx` | Checkboxes, bulk toolbar, remove progress bar |
| `src/hooks/useSupplierStaff.ts` | Add resetPassword and bulkSetStatus |


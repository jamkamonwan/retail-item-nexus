

# Add Bulk Action Bar with Checkboxes to User Management

## Overview

Add row-level checkboxes and a persistent bulk action bar to both Supplier Users and Internal Users tables. When users are selected via checkboxes, the action bar shows with "Reset Password" and "Set Inactive" buttons.

## Changes

### 1. Update `SupplierUserTable.tsx` -- Add checkboxes and selection state

- Add `selectedIds` state (Set of user IDs) and a "select all" checkbox in the header
- Add a Checkbox column as the first column in each row
- When at least one user is selected, show a bulk action bar above the table with:
  - "X selected" count label
  - "Reset Password" button
  - "Set Inactive" button
- New props: `onBulkResetPassword(userIds: string[])` and `onBulkDeactivate(userIds: string[])`
- Clear selection after bulk action completes

### 2. Update `UserTable.tsx` -- Same checkbox and action bar pattern

- Mirror the same checkbox + bulk action bar pattern as SupplierUserTable
- Same new props: `onBulkResetPassword` and `onBulkDeactivate`

### 3. Update `UserManagement.tsx` -- Wire up bulk handlers

- Add `handleBulkResetPassword(userIds: string[])` -- shows confirmation dialog, then calls `resetPassword` for each user
- Add `handleBulkDeactivate(userIds: string[])` -- shows confirmation dialog, then calls `deactivateUser` for each user
- Pass these as new props to both table components

## Action Bar Layout

```text
+------------------------------------------------------+
| 3 selected    [Reset Password]   [Set Inactive]       |
+------------------------------------------------------+
| [ ] | User        | Role   | ...                      |
| [x] | John Doe    | Admin  | ...                      |
| [x] | Jane Smith  | Buyer  | ...                      |
| [x] | Bob Lee     | SCM    | ...                      |
+------------------------------------------------------+
```

## Files Modified

| File | Change |
|------|--------|
| `src/components/admin/SupplierUserTable.tsx` | Add checkbox column, selection state, bulk action bar |
| `src/components/admin/UserTable.tsx` | Add checkbox column, selection state, bulk action bar |
| `src/components/admin/UserManagement.tsx` | Add bulk handler functions, pass to both tables |


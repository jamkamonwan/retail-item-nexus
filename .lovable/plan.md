

# Supplier Admin Staff User Management

## Overview

Build a dedicated **Supplier Admin** dashboard view where a Supplier Admin can manage normal supplier staff users within their Supplier Group. This includes creating users (with tier-based headcount limits), toggling user status, and manually assigning modules from their tier's available modules.

## Current State

- The `supplier_admin` role falls through to the default "approver" case in `AuthenticatedWorkflowApp.tsx` -- it has no dedicated dashboard
- Tiers define `maxUsers` and `activeModules` per group
- Mock users already have `supplierGroupId` linking them to groups
- `MockUser` interface has no `assignedModules` field yet

## Changes

### 1. Add `assignedModules` to MockUser (`src/data/mock/users.ts`)
- Add optional `assignedModules?: string[]` to the `MockUser` interface
- Populate existing supplier mock users with sample module assignments
- This tracks which tier modules a staff user has been granted

### 2. Create `SupplierAdminDashboard` component (`src/components/npd/dashboards/SupplierAdminDashboard.tsx`)

Main screen for Supplier Admins showing:

**Header section:**
- Group name, tier name, and headcount gauge (e.g., "4 / 10 users")
- "Create Staff User" button -- disabled with tooltip when headcount is reached

**Staff User table:**
- Columns: Name, Email, Status (active/inactive), Assigned Modules, Actions
- Actions: Toggle Active/Inactive, Edit Modules, Reset Password
- Inactive users shown but not counted toward the headcount limit

**Headcount guardrail logic:**
- Count only `active` supplier users (not supplier_admin) in the same group
- Compare against `tier.maxUsers`
- Block creation when limit reached; show message to deactivate a user first

### 3. Create `StaffUserFormDialog` (`src/components/admin/StaffUserFormDialog.tsx`)

Simplified create dialog for Supplier Admin use:
- Fields: Full Name, Email (role is auto-set to "supplier")
- Module assignment: checkboxes from the tier's `activeModules` list only
- No role or group selection needed (inherited from the admin's group)
- Submit creates the user with the admin's `supplierGroupId`

### 4. Create `StaffModuleDialog` (`src/components/admin/StaffModuleDialog.tsx`)

Edit dialog for changing a staff user's assigned modules:
- Shows only modules available in the group's tier
- Checkbox list with module names and descriptions
- Save updates the user's `assignedModules` array

### 5. Add `supplier_admin` case to `AuthenticatedWorkflowApp.tsx`

- Add `supplier_admin` to the navigation tabs: "My Staff", "My Submissions", "New Entry"
- Add `supplier_admin` case in `renderDashboard()` to render `SupplierAdminDashboard`
- Add `staff` to the `View` type
- Wire up the new view

### 6. Create `useSupplierStaff` hook (`src/hooks/useSupplierStaff.ts`)

Hook that encapsulates staff management logic for a given group:
- `staffUsers`: filtered list of supplier users in the group (excluding the admin)
- `activeCount`: number of active staff users
- `tier`: the tier assigned to this group (looked up from `mockTiers`)
- `maxUsers`: from the tier
- `canCreateUser`: `activeCount < maxUsers`
- `createStaffUser(data)`: creates a new supplier user in the group
- `toggleUserStatus(userId)`: switches active/inactive
- `updateModules(userId, modules)`: updates assigned modules

## Files

| File | Change |
|------|--------|
| `src/data/mock/users.ts` | Add `assignedModules` to interface and mock data |
| `src/hooks/useSupplierStaff.ts` | New hook for staff CRUD with headcount logic |
| `src/components/npd/dashboards/SupplierAdminDashboard.tsx` | New dashboard component |
| `src/components/admin/StaffUserFormDialog.tsx` | New create staff user dialog |
| `src/components/admin/StaffModuleDialog.tsx` | New edit modules dialog |
| `src/components/npd/dashboards/index.ts` | Export new dashboard |
| `src/components/npd/AuthenticatedWorkflowApp.tsx` | Add supplier_admin nav + view |

## UI Layout

```text
+--------------------------------------------------+
| [Supplier Admin] Group Unilever                   |
| Tier A - Premium    Users: 3 / 20 active          |
+--------------------------------------------------+
| [Create Staff User]                               |
+--------------------------------------------------+
| Name          | Email           | Modules | Status|
| John Supplier | john@acme.com   | 3 of 8  | Active|
| Old Supplier  | old@inc.com     | 0 of 8  | Inact.|
+--------------------------------------------------+
```

When headcount is full:
```text
| Users: 10 / 10 active (LIMIT REACHED)            |
| [Create Staff User] (disabled)                    |
| "Deactivate a user before creating a new one"     |
```


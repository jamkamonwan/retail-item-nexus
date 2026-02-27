

# Fix Labels and Add Tier Column to Supplier User Table

## Overview

Three changes: (1) Add a "Tier" column to the Supplier Users table in User Management, (2) rename labels across admin screens, and (3) remove tier name from the Supplier Admin dashboard.

## Changes

### 1. Add "Tier" column to Supplier User Table (`SupplierUserTable.tsx`)

Look up the tier for each supplier user via their `supplierGroupId` using `mockTiers.assignedGroups`. Display the tier name as a colored badge, or leave blank if no tier is assigned.

- Import `mockTiers` from `@/data/mock/tiers`
- Add helper: `const getTierForGroup = (groupId?: string) => groupId ? mockTiers.find(t => t.assignedGroups.includes(groupId)) : undefined`
- Add "Access Plan" column header after "Supplier Codes"
- Render tier badge or empty cell per row

### 2. Rename labels across admin screens

| Old Label | New Label | Files |
|-----------|-----------|-------|
| Create Tier | Create Access Plan | `TierManagement.tsx`, `TierFormDialog.tsx` |
| Update Tier | Update Access Plan | `TierFormDialog.tsx` |
| Edit Tier | Edit Access Plan | `TierFormDialog.tsx` |
| Create New Tier | Create New Access Plan | `TierFormDialog.tsx` |
| Tier & Module Configuration | Access Plan & Module Configuration | `TierManagement.tsx` |
| Tier & Module Config | Access Plan & Module Config | `AdminDashboard.tsx` |
| Tier Name | Access Plan Name | `TierFormDialog.tsx` |
| Select a tier | Select an access plan | `TierManagement.tsx` |
| Delete [tier name]? | Delete [name]? | `TierManagement.tsx` |
| tier has X supplier groups | access plan has X supplier partners | `TierManagement.tsx` |
| New Supplier Group | New Supplier Partner | `SupplierGroupFormDialog.tsx` |
| Create Supplier Group | Create Supplier Partner | `SupplierGroupFormDialog.tsx` |
| Supplier Groups (heading) | Supplier Partners | `SupplierGroupManagement.tsx` |
| Assigned Supplier Groups | Assigned Supplier Partners | `TierManagement.tsx` |
| Supplier Groups -- tier | Supplier Partners -- plan | `TierSupplierDialog.tsx` |
| supplier groups assigned | supplier partners assigned | `TierSupplierDialog.tsx` |
| No supplier groups assigned | No supplier partners assigned | `TierManagement.tsx` |
| Supplier Group (column) | Supplier Partner | `SupplierUserTable.tsx` |
| Supplier Group * (label) | Supplier Partner * | `UserFormDialog.tsx` |
| Select a supplier group | Select a supplier partner | `UserFormDialog.tsx` |
| Tier (column in group list) | Access Plan | `SupplierGroupManagement.tsx` |

### 3. Remove Tier name from Supplier Admin Dashboard (`SupplierAdminDashboard.tsx`)

Remove line 59-61 that shows `{tier ? tier.name -- tier.description : 'No tier assigned'}`. The supplier admin should not see the tier/access plan name.

## Files Modified

| File | Change |
|------|--------|
| `src/components/admin/SupplierUserTable.tsx` | Add Access Plan column with tier badge lookup |
| `src/components/admin/TierManagement.tsx` | Rename Tier to Access Plan, Supplier Group to Supplier Partner |
| `src/components/admin/TierFormDialog.tsx` | Rename Tier labels to Access Plan |
| `src/components/admin/TierSupplierDialog.tsx` | Rename Supplier Group to Supplier Partner |
| `src/components/admin/SupplierGroupManagement.tsx` | Rename Supplier Group to Supplier Partner, Tier to Access Plan |
| `src/components/admin/SupplierGroupFormDialog.tsx` | Rename Supplier Group to Supplier Partner |
| `src/components/admin/UserFormDialog.tsx` | Rename Supplier Group label to Supplier Partner |
| `src/components/npd/dashboards/AdminDashboard.tsx` | Rename Tier & Module Config to Access Plan & Module Config |
| `src/components/npd/dashboards/SupplierAdminDashboard.tsx` | Remove tier name/description display |


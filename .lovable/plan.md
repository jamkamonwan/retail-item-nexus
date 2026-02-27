

# Split User Management: Supplier vs Internal + Show Group & Codes

## Overview

Add tabs to the User Management screen separating **Supplier Users** and **Internal Users**, and update the supplier table to show **Supplier Group** and **Supplier Codes** columns instead of the single "Supplier" column.

## Changes

### 1. Update mock supplier users (`src/data/mock/users.ts`)
- Add `supplierGroupId: 'group-001'` to `user-supplier-001` (ACME is in Group Unilever's supplier list -- or assign to group-002)
- Add `supplierGroupId` to `user-supplier-002`
- This ensures supplier users resolve to a group with associated codes

### 2. Add Tabs to `src/components/admin/UserManagement.tsx`
- Import `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- Split `users` into `supplierUsers` (role is `supplier` or `supplier_admin`) and `internalUsers` (all others)
- Supplier tab renders `SupplierUserTable`, Internal tab renders the existing `UserTable` (without supplier column)
- Each tab shows its own count badge
- Filters and Create User button remain shared in the header

### 3. Create `src/components/admin/SupplierUserTable.tsx`
- New table component for supplier/supplier_admin users
- Columns: **User** (name + email), **Role**, **Supplier Group** (resolved from `supplierGroupId` via `mockSupplierGroups`), **Supplier Codes** (all codes from the group's `supplierIds`, resolved to numeric codes via `mockSuppliers`), **Status**, **Last Login**, **Actions**
- Import `mockSupplierGroups` and `mockSuppliers` to resolve group name and codes
- Remove Department column (not relevant for supplier users)

### 4. Update `src/components/admin/UserTable.tsx` for internal-only use
- Remove the "Supplier" column since internal users don't have supplier associations
- Keep: User, Role, Department, Status, Last Login, Created, Actions

## Files

| File | Change |
|------|--------|
| `src/data/mock/users.ts` | Add `supplierGroupId` to supplier mock users |
| `src/components/admin/UserManagement.tsx` | Add Tabs splitting supplier vs internal users |
| `src/components/admin/SupplierUserTable.tsx` | New file -- table with Supplier Group + Codes columns |
| `src/components/admin/UserTable.tsx` | Remove Supplier column (internal users only) |


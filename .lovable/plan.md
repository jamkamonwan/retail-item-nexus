

# Fix User Form: Supplier Group Selection + Auto Fill

## Overview

The User Form Dialog still uses a multi-supplier-code picker for Supplier Admin. Per the approved user story, it should use a single **Supplier Group** dropdown instead. The Auto Fill also needs updating to select a random group.

## Changes

### 1. Update types (`src/types/admin.ts`)
- Replace `supplierIds?: string[]` with `supplierGroupId?: string` in `UserProfile`, `CreateUserData`, and `UpdateUserData`

### 2. Update mock users (`src/data/mock/users.ts`)
- Replace `supplierIds` with `supplierGroupId` in the `MockUser` interface and any mock data that uses it

### 3. Rewrite Supplier Admin section in `src/components/admin/UserFormDialog.tsx`
- Remove the multi-supplier search/select UI (search input, filtered dropdown, selected badges list)
- Remove `selectedSupplierIds` state, `supplierSearch` state, `filteredSuppliers` memo, `addSupplier`/`removeSupplier` helpers
- Add a single Supplier Group `<Select>` dropdown, imported from `mockSupplierGroups`
- Add `supplierGroupId` to the zod schema and form values
- Each dropdown option shows: Group Name + number of supplier codes
- Update `handleSubmit` to pass `supplierGroupId` instead of `supplierIds`
- Update `handleAutoFill` to pick a random supplier group instead of random supplier codes
- Keep the info note about welcome email

### 4. Update hook (`src/hooks/useUsers.ts`)
- Replace `supplierIds` references with `supplierGroupId` in `createUser` and `updateUser`

### Files Modified

| File | Change |
|------|--------|
| `src/types/admin.ts` | `supplierIds` to `supplierGroupId` |
| `src/data/mock/users.ts` | `supplierIds` to `supplierGroupId` in interface |
| `src/components/admin/UserFormDialog.tsx` | Replace multi-supplier picker with single group dropdown; fix auto fill |
| `src/hooks/useUsers.ts` | `supplierIds` to `supplierGroupId` |




# Add Supplier Admin Role with Multi-Supplier Code Assignment

## Overview

Add a new "Supplier Admin" role to the existing Create/Edit User screen. When this role is selected, the form shows a searchable multi-select for supplier codes, allowing one Supplier Admin to be linked to multiple suppliers (e.g., adminUnilever linked to codes 83790, 34355, 34443).

---

## Changes

### 1. Add `supplier_admin` role

**`src/types/npd.ts`** -- Add to `UserType` union and `USER_TYPES` map:
```typescript
export type UserType = '...' | 'supplier_admin';
// USER_TYPES:
supplier_admin: { label: 'Supplier Admin', description: 'Primary supplier administrator' }
```

**`src/data/mock/users.ts`** -- Add `supplier_admin` to `MockRole` type. Add `supplierIds?: string[]` to `MockUser` interface for multi-supplier support.

### 2. Update types for multi-supplier

**`src/types/admin.ts`**:
- Add `supplierIds?: string[]` to `UserProfile`, `CreateUserData`, and `UpdateUserData`

**`src/hooks/useUsers.ts`**:
- Update `CreateUserData` and `UpdateUserData` to include `supplierIds?: string[]`
- Update `createUser` to store `supplierIds` on the new user
- When role is `supplier_admin`, show a welcome email toast

### 3. Update the Create/Edit User Dialog

**`src/components/admin/UserFormDialog.tsx`**:

- Add `supplier_admin` to the `DUMMY_ROLES` array
- Update form schema to include `supplierIds: z.array(z.string()).optional()`
- When "Supplier Admin" role is selected:
  - Auto-set user type to "External"
  - Hide the single supplier dropdown
  - Show a **multi-supplier selector** section instead:
    - A search input to filter suppliers by code or name
    - A scrollable list of matching suppliers with "Add" buttons
    - Below the search, show selected suppliers as a table/list with columns: **Code** | **Name** | **Remove button**
    - Example display after selection:
      ```
      Selected Suppliers (2):
      83790    Unilever - Hardline     [x]
      353535   Unilever - Homeline2    [x]
      ```
- Add an info note: "Supplier Admin does not count toward the tier's normal user limit"
- On submit, pass `supplierIds` array instead of single `supplierId`

### 4. Add more realistic supplier mock data

**`src/data/mock/suppliers.ts`** -- Add a few more suppliers with numeric-style codes to match the user's example:
```typescript
{ id: 'supplier-009', name: 'Unilever - Hardline', code: '83790', ... },
{ id: 'supplier-010', name: 'Unilever - Homeline', code: '34355', ... },
{ id: 'supplier-011', name: 'Unilever - Personal Care', code: '34443', ... },
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types/npd.ts` | Add `supplier_admin` to UserType and USER_TYPES |
| `src/data/mock/users.ts` | Add `supplier_admin` to MockRole, add `supplierIds` to MockUser |
| `src/data/mock/suppliers.ts` | Add Unilever supplier entries with numeric codes |
| `src/types/admin.ts` | Add `supplierIds` to UserProfile, CreateUserData, UpdateUserData |
| `src/hooks/useUsers.ts` | Handle `supplierIds` in create/update, welcome email toast for supplier_admin |
| `src/components/admin/UserFormDialog.tsx` | Add supplier_admin role behavior, multi-supplier search/select UI |

---

## UI Behavior Summary

1. Admin opens Create User dialog
2. Selects role "Supplier Admin" from dropdown
3. User type auto-switches to "External"
4. Single supplier dropdown is replaced by a **multi-supplier selector**:
   - Search box filters suppliers by code or name
   - Clicking a result adds it to the selected list
   - Selected suppliers shown as rows with code, name, and remove button
5. On submit: user is created with `role: supplier_admin`, `supplierIds: [...]`
6. Toast: "Supplier Admin provisioned. Welcome email sent to [email]"

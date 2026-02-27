

# Supplier Group Creation & Code Mapping

## Overview

Add a new **Supplier Groups** management screen under the Admin navigation. IT Admins can create Supplier Groups (e.g., "Group A DKSH"), search and assign multiple Supplier Codes to each group, with the constraint that one Supplier Code can only belong to one Group at a time.

---

## New Files

### 1. Mock Data: `src/data/mock/supplierGroups.ts`
- Define `MockSupplierGroup` interface: `{ id, name, description?, supplierIds: string[], createdAt }`
- Seed with 2 sample groups (e.g., "Group Unilever" with supplier codes 83790/34355/34443, "Group DKSH" with DKSH supplier)
- Export helpers: `mockSupplierGroups` array

### 2. Hook: `src/hooks/useSupplierGroups.ts`
- In-memory CRUD over `mockSupplierGroups`
- `createGroup(name, description)` -- creates new group
- `updateGroup(id, data)` -- edit name/description
- `deleteGroup(id)` -- only if no suppliers assigned
- `assignSupplier(groupId, supplierId)` -- enforces one-group-per-supplier rule
- `removeSupplier(groupId, supplierId)` -- unlinks a supplier code
- Helper: `getSupplierGroup(supplierId)` -- returns which group a supplier belongs to (for conflict detection)

### 3. UI Component: `src/components/admin/SupplierGroupManagement.tsx`
- **List View**: Table showing Group Name, Supplier Count, Created date, Edit/Delete actions
- **Detail View** (click a row): Shows group info + assigned suppliers table (Code | Name | Remove) + "Add Supplier" button opening a search dialog
- Reuses the same pattern as `TierManagement.tsx` (list view -> detail view)

### 4. Group Form Dialog: `src/components/admin/SupplierGroupFormDialog.tsx`
- Simple dialog with Name and Description fields for create/edit

### 5. Group Supplier Dialog: `src/components/admin/GroupSupplierDialog.tsx`
- Search input to filter suppliers by code or name
- Shows unassigned suppliers (not in any group) as selectable
- If a supplier is already in another group, show it grayed out with the group name label
- Selected suppliers added via `assignSupplier(groupId, supplierId)`

---

## Modified Files

### 6. `src/data/mock/index.ts`
- Add `export * from './supplierGroups'`

### 7. `src/components/admin/index.ts`
- Add `export { SupplierGroupManagement } from './SupplierGroupManagement'`

### 8. `src/components/npd/AuthenticatedWorkflowApp.tsx`
- Add `'supplier-groups'` to the `View` type
- Add a new tab "Supplier Groups" (with a `FolderTree` icon) in the admin navigation tabs
- Render `<SupplierGroupManagement>` when `currentView === 'supplier-groups'`

---

## UI Behavior

1. Admin clicks "Supplier Groups" tab in navigation
2. Sees a table of existing groups with supplier counts
3. Clicks "New Group" to create -- enters name and description
4. Clicks a group row to open detail view
5. In detail view, clicks "Add Supplier" to open search dialog
6. Searches by code or name, clicks to assign -- system validates one-group-per-supplier rule
7. Can remove suppliers from the group
8. Can edit group name or delete empty groups

## One-Group-Per-Supplier Enforcement

When assigning a supplier, the system checks all existing groups. If the supplier code is already assigned to another group, it shows the supplier as disabled with a label like "Already in: Group DKSH" and prevents assignment.


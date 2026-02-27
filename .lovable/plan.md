

# Change Tier Assignment from Individual Suppliers to Supplier Groups

## Overview

Currently, Tiers assign individual supplier codes (e.g., `supplier-001`). The user wants Tiers to assign **Supplier Groups** instead (e.g., "Group Unilever", "Group DKSH"), since groups are the primary entity.

## Changes

### 1. Data Model: `src/data/mock/tiers.ts`
- Rename `assignedSuppliers: string[]` to `assignedGroups: string[]` in the `MockTier` interface
- Update seed data to reference group IDs (`group-001`, `group-002`) instead of supplier IDs

### 2. Hook: `src/hooks/useTiers.ts`
- Rename all `assignedSuppliers` references to `assignedGroups`
- Update `assignSupplier` to `assignGroup` and `removeSupplier` to `removeGroup`
- Deletion guard: check `assignedGroups.length` instead of `assignedSuppliers.length`
- One-tier-per-group enforcement stays the same logic, just operating on group IDs

### 3. Tier Detail View: `src/components/admin/TierManagement.tsx`
- Replace the "Assigned Suppliers" card with "Assigned Supplier Groups"
- Show group name, supplier count (from group's `supplierIds.length`), and description
- Import `mockSupplierGroups` to look up group info instead of `mockSuppliers`
- Update the list view column from "Suppliers" to "Groups" with group count
- Update delete warning text to reference groups

### 4. Tier Supplier Dialog: `src/components/admin/TierSupplierDialog.tsx`
- Rename to `TierGroupDialog` (or keep file name, rename component)
- Change props from supplier-based to group-based: search/assign/remove **Supplier Groups** instead of individual suppliers
- Show group name + number of supplier codes in each group
- Enforce one-tier-per-group: groups already assigned to another tier are shown disabled

### Files Modified

| File | Change |
|------|--------|
| `src/data/mock/tiers.ts` | Rename `assignedSuppliers` to `assignedGroups`, update seed data |
| `src/hooks/useTiers.ts` | Rename methods and fields from supplier to group |
| `src/components/admin/TierManagement.tsx` | Show groups instead of suppliers in detail and list views |
| `src/components/admin/TierSupplierDialog.tsx` | Rewrite to search/assign/remove supplier groups |


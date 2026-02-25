

# Tier Detail: Edit Dialog + Supplier Assignment

## Overview

Enhance the Tier detail page with two features:
1. **Edit icon** opens a popup to edit tier name/description and add modules
2. **Suppliers column** is clickable to view/add/remove suppliers assigned to that tier

---

## Data Changes

### `src/data/mock/tiers.ts`

Add a `assignedSuppliers` field to `MockTier` to track which supplier IDs belong to each tier:

```typescript
export interface MockTier {
  // ... existing fields
  assignedSuppliers: string[]; // supplier IDs
}
```

Update the mock data to pre-assign suppliers to tiers (using IDs from `mockSuppliers`).

### `src/data/mock/suppliers.ts`

Add two more suppliers to make the demo richer (e.g., "DKSH Thailand", "Thainamthip Co.").

---

## UI Changes

### 1. Tier Detail Page -- Edit Button (already exists, refine behavior)

The existing "Edit Tier" button already opens `TierFormDialog`. No major change needed here -- just ensure it works correctly for editing name, description, color, and modules.

### 2. Tier Detail Page -- Supplier Assignment Section

Replace the static "X suppliers assigned" text with an interactive **Supplier Assignment Card**:

```text
+----------------------------------------------------------+
| Assigned Suppliers (3)                    [+ Add Supplier] |
|----------------------------------------------------------|
| DKSH Thailand          DKSH       [x Remove]             |
| Thainamthip Co.        TNAM       [x Remove]             |
| ACME Corporation       ACME       [x Remove]             |
+----------------------------------------------------------+
```

- Shows list of assigned supplier names and codes
- "Add Supplier" button opens a dialog/popover with unassigned suppliers to pick from
- "Remove" button removes a supplier from the tier (with confirmation)

### 3. List View -- Clickable Suppliers Column

In the tier list table, make the Suppliers cell clickable:
- Clicking the supplier count navigates to the tier detail page (same as clicking the row)
- The supplier count badge gets a hover style to indicate it's interactive

### 4. New Component: `TierSupplierDialog.tsx`

A dialog to add/remove suppliers for a tier:
- Shows currently assigned suppliers with remove buttons
- Shows unassigned (available) suppliers with add buttons
- Search/filter for supplier name

---

## Hook Changes

### `src/hooks/useTiers.ts`

Add two new functions:
- `assignSupplier(tierId: string, supplierId: string)` -- adds supplier to tier, updates supplierCount
- `removeSupplier(tierId: string, supplierId: string)` -- removes supplier from tier, updates supplierCount

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/data/mock/tiers.ts` | Modify | Add `assignedSuppliers` to MockTier interface and mock data |
| `src/data/mock/suppliers.ts` | Modify | Add DKSH and Thainamthip suppliers |
| `src/hooks/useTiers.ts` | Modify | Add `assignSupplier` and `removeSupplier` functions |
| `src/components/admin/TierSupplierDialog.tsx` | **Create** | Dialog to manage supplier assignments per tier |
| `src/components/admin/TierManagement.tsx` | Modify | Add supplier assignment card in detail view, make supplier column interactive |
| `src/components/admin/index.ts` | Modify | Export new component |

---

## Technical Details

- The `assignedSuppliers` array on each tier stores supplier IDs
- The supplier list is sourced from `mockSuppliers` (active only)
- A supplier can only be assigned to one tier at a time (adding to a new tier removes from old)
- `supplierCount` is derived from `assignedSuppliers.length` (replace the static number)


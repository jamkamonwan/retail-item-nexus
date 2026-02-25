

# User Story 2: Tier-Based Headcount Limits

## Overview

Add a "Max User Limit" field to each Tier that controls how many Normal Supplier users a Supplier Admin can create under that tier. This limit is displayed across the tier list, detail page, and enforced in the create/edit dialog.

---

## Data Model Changes

### `src/data/mock/tiers.ts`

Add `maxUsers: number` to the `MockTier` interface and set defaults in mock data:

- Tier A: `maxUsers: 20`
- Tier B: `maxUsers: 10`
- Tier C: `maxUsers: 5`

---

## UI Changes

### 1. Tier List Table (`TierManagement.tsx`)

Add a new **Max Users** column between Suppliers and Actions showing the limit (e.g., "20 users"). Uses a `Users` icon for consistency.

### 2. Tier Detail Page (`TierManagement.tsx`)

Display the max user limit in a summary card or inline info row beneath the tier header, e.g.:

```
Max User Limit: 20 normal supplier users per supplier
```

### 3. Create/Edit Dialog (`TierFormDialog.tsx`)

Add a **Max User Limit** number input field between the Description and Color fields. The submit payload will include `maxUsers`.

---

## Hook Changes

### `src/hooks/useTiers.ts`

Update `createTier` to accept `maxUsers` in the input type, and `updateTier` to allow partial updates including `maxUsers`.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/data/mock/tiers.ts` | Add `maxUsers` to interface and mock data |
| `src/hooks/useTiers.ts` | Include `maxUsers` in create/update types |
| `src/components/admin/TierFormDialog.tsx` | Add Max User Limit number input and include in submit |
| `src/components/admin/TierManagement.tsx` | Show Max Users column in list table and info in detail view |


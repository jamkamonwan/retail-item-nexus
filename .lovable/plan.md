

# Redesign Tier Display: Grid Cards to Row-Based List with Detail Page

## Problem

With many tiers (e.g., 10+), the current grid card layout becomes overwhelming vertically. The Module Access Matrix table also becomes too wide with many tier columns.

## Solution

Replace the tier cards grid and module matrix with a **tier list table** on the main page. Each tier row is clickable to navigate to a **Tier Detail page** showing that tier's module configuration.

### Main Page Layout (Tier List)

```text
+--------------------------------------------------------------+
| <- Back   Tier & Module Configuration        [+ New Tier]     |
+--------------------------------------------------------------+
| Name       | Description          | Modules | Suppliers | Actions |
|------------|----------------------|---------|-----------|---------|
| Tier A     | Premium - Full access|    8    |    12     | Edit Del|
| Tier B     | Standard - Core ops  |    5    |    25     | Edit Del|
| Tier C     | Basic - Essential    |    2    |     8     | Edit Del|
+--------------------------------------------------------------+
```

- Each row is clickable -- navigates to a detail view for that tier
- Compact, scales well to 10+ tiers
- Edit/Delete actions remain inline

### Tier Detail Page (New)

When a tier row is clicked, show a detail view with:

```text
+--------------------------------------------------------------+
| <- Back to Tiers    Tier A - Premium         [Edit Tier]      |
| Full access to all modules                                    |
+--------------------------------------------------------------+
| Module Access (8 of 8 active)                                |
|--------------------------------------------------------------|
| [x] New Item Creation        - Create and manage products    |
| [x] Supply Chain Management  - Track supply chain ops        |
| [x] Pricing & Promotions     - Manage pricing rules         |
| [x] Compliance & Cert.       - Regulatory compliance        |
| ...                                                          |
+--------------------------------------------------------------+
| 12 suppliers assigned to this tier                           |
+--------------------------------------------------------------+
```

- Toggle modules directly on this page
- Shows tier summary info (description, supplier count)

## Technical Changes

### File: `src/components/admin/TierManagement.tsx`

1. Add a `selectedTier` state for navigating between list and detail views
2. Replace the grid card section (lines 77-115) with a **Table** showing tiers as rows
3. Replace the Module Matrix section (lines 117-161) with a **Tier Detail view** shown when a tier is selected
4. Each row: tier name (colored badge), description, module count, supplier count, edit/delete buttons
5. Click on row navigates to detail view with back button

### No new files needed

The `TierManagement.tsx` component handles both views internally using state (`selectedTier: MockTier | null`):
- `null` = show tier list table
- set = show detail page for that tier with module toggles

This keeps the existing dialog, delete confirmation, and hook logic unchanged.

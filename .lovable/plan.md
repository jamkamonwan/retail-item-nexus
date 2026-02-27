

# Tier Management: 2-Column Split Layout

## Overview

Replace the current separate list view / detail view pattern with a persistent **2-column split layout** so the admin always sees the Tier list on the left and the selected tier's details (modules + groups) on the right. This eliminates page transitions and gives instant visual mapping of Tier -> Modules -> Groups.

## Layout

```text
+-------------------+------------------------------------------+
| Tier List (Left)  |  Tier Detail (Right)                     |
|                   |                                          |
| [+ Create Tier]   |  Tier: Premium                           |
|                   |  Max Users: 10                           |
|  * Basic          |                                          |
|  > Premium  <--   |  Allowed Modules:                        |
|  * Enterprise     |  [x] Item Review                         |
|                   |  [x] Pricing                             |
|                   |  [ ] Analytics                           |
|                   |                                          |
|                   |  Assigned Supplier Groups:               |
|                   |  ACME Group  [Remove]                    |
|                   |  Global Foods [Remove]                   |
|                   |  [+ Add Supplier Group]                  |
+-------------------+------------------------------------------+
```

## Changes

### 1. Rewrite `TierManagement.tsx` layout

**Current**: Two separate renders -- a table list view OR a detail view (conditionally rendered, full-page swap with back button).

**New**: Single render with a 2-column flex layout:
- **Left panel** (~300px, border-right): Scrollable list of tier cards/items. Each item shows tier name badge, module count, and group count. Clicking selects the tier (highlighted state). "Create Tier" button at top. Edit/Delete actions inline per item.
- **Right panel** (flex-1): Shows the selected tier's detail -- module checkboxes and assigned supplier groups table. If no tier is selected, show an empty state prompt ("Select a tier to view details"). Edit Tier button in the right panel header.
- Auto-select the first tier on mount so the right panel is never empty initially.

### 2. Keep all existing functionality intact

- Create/Edit tier dialog, Delete confirmation dialog, Module toggle, Group assign/remove, and TierSupplierDialog all remain unchanged.
- Only the layout structure changes -- no logic or hook modifications needed.

## Technical Details

- Use standard flexbox (`flex` with `w-80` left + `flex-1` right) rather than `ResizablePanelGroup` to keep it simple.
- Left panel items use a vertical list with `cursor-pointer` and a highlighted background (`bg-accent`) for the selected tier.
- The `onBack` prop still works -- the back arrow in the page header navigates back to the Admin Dashboard.
- `selectedTierId` defaults to `tiers[0]?.id` instead of `null`.

## Files Modified

| File | Change |
|------|--------|
| `src/components/admin/TierManagement.tsx` | Rewrite to 2-column split layout |


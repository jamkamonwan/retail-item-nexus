

# Show Assigned Tier on Supplier Group Screen

## Overview

Display the assigned Tier name next to each Supplier Group -- both in the list view table and the detail view header. If no tier is assigned, show nothing (blank).

## How It Works

The tier-to-group relationship already exists in `mockTiers` data (each tier has an `assignedGroups` array). We just need to look up which tier contains each group's ID and display it.

## Changes

### 1. List View -- Add "Tier" column to the groups table

Add a new column between "Suppliers" and "Created" that shows the tier name as a colored badge if assigned, or leaves the cell empty if not.

### 2. Detail View -- Show Tier in the group header

Below the group name/description, display "Tier: Premium" (as a badge) when a tier is assigned. If no tier is assigned, show nothing.

### 3. No data model changes needed

The mapping already exists in `mockTiers.assignedGroups`. We just import `mockTiers` and do a simple lookup.

## Files Modified

| File | Change |
|------|--------|
| `src/components/admin/SupplierGroupManagement.tsx` | Import `mockTiers`, add helper to find tier for a group, add Tier column to list table, show tier badge in detail view |


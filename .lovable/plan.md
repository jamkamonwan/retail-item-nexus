

# Fix User Management: More Mock Data + Verify Tabs

## Issues Found

1. **Only 2 supplier users** in mock data -- no `supplier_admin` users at all
2. **Internal Users tab exists** in the code and should be working (the screenshot shows it). The tab may appear non-functional if the user hasn't clicked it. No code fix needed for the tab itself -- it's already implemented correctly.
3. Need more supplier groups to support additional supplier users

## Changes

### 1. Add more supplier groups (`src/data/mock/supplierGroups.ts`)
- Add 2 new groups: "Group Nestle" (with supplier codes from existing suppliers like supplier-001, supplier-002) and "Group CP" (with supplier-003, supplier-004, supplier-005)
- This gives us 4 groups total to assign to supplier users

### 2. Add more supplier + supplier_admin mock users (`src/data/mock/users.ts`)
- Add 4-5 new supplier/supplier_admin users across different groups:
  - A Supplier Admin for Group Unilever
  - A Supplier Admin for Group Nestle
  - A Supplier user for Group Nestle
  - A Supplier user for Group CP
  - An inactive supplier user for variety
- Each linked to a `supplierGroupId`

### Files Modified

| File | Change |
|------|--------|
| `src/data/mock/supplierGroups.ts` | Add 2 new supplier groups |
| `src/data/mock/users.ts` | Add 5 new supplier/supplier_admin mock users |

No changes needed for the tabs or table components -- they already work correctly with the existing code.




# Fix Supplier Group Form & Supplier Codes

## Changes

### 1. Add Auto-Fill button to `src/components/admin/SupplierGroupFormDialog.tsx`
- Add a "Auto Fill with Dummy Data" button that populates the form with random mock data
- Generates a random group name (e.g., "Group Nestle", "Group P&G") and description

### 2. Change supplier codes from string to integer in `src/data/mock/suppliers.ts`
- Update all supplier `code` values from text strings (e.g., `'ACME'`, `'GFOOD'`) to numeric strings representing integers (e.g., `'10001'`, `'10002'`)
- The `code` field type stays `string` in TypeScript (since it's displayed as text), but all values will be numeric integers like real supplier codes (e.g., `83790`, `34355`)

### Files Modified

| File | Change |
|------|--------|
| `src/data/mock/suppliers.ts` | Replace all text-based codes with 5-digit integer codes |
| `src/components/admin/SupplierGroupFormDialog.tsx` | Add "Auto Fill" button that generates random group name + description |




# Fix Auto Fill to Always Show Supplier Codes (2-3 suppliers)

## Problem

When clicking "Auto Fill", the role is randomly selected from all available roles. The `supplier_admin` role is only one of many, so it rarely gets picked -- meaning the supplier code multi-select never gets populated during auto-fill testing.

## Solution

Update the `handleAutoFill` function so that when it generates a `supplier_admin` role, the 2-3 supplier codes are reliably shown. Additionally, increase the likelihood of `supplier_admin` being selected during auto-fill to make it easier to demo.

### Changes in `src/components/admin/UserFormDialog.tsx`

1. **Bias the Auto Fill toward `supplier_admin`**: Make the auto-fill always generate `supplier_admin` role (or at least heavily favor it) so that clicking Auto Fill reliably demonstrates the multi-supplier assignment feature. Alternatively, rotate so every other auto-fill picks `supplier_admin`.

2. **Ensure 2-3 suppliers are pre-selected**: The existing logic at lines 170-178 already does this, but the `suppliers` passed from `useSuppliers` are pre-filtered (no `isActive` field). Fix the filter at line 172 to not re-check `isActive` since those are already active suppliers.

### Specific code changes

- In `handleAutoFill`, always set `dummyData.role = 'supplier_admin'` (since the user wants to demo this feature), or alternate between supplier_admin and other roles.
- Remove the `.filter(s => s.isActive)` on line 172 since the `suppliers` prop already contains only active suppliers.
- Ensure `form.setValue('userType', 'external')` is also called so the UI updates correctly.

### File

| File | Change |
|------|--------|
| `src/components/admin/UserFormDialog.tsx` | Update `handleAutoFill` to always generate supplier_admin with 2-3 pre-selected suppliers |


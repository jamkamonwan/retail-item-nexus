

## Simplify User Management Search Bar

### What Changes
Remove the **Department** and **Supplier** filter dropdowns from the search bar, keeping only **Search**, **Role**, and **Status** filters. The Role filter will naturally drive which tab shows results -- selecting Supplier or Supplier Admin roles populates the Supplier Users tab, while internal roles populate the Internal Users tab.

### Technical Details

**File: `src/components/admin/UserFilters.tsx`**
- Remove the `departments` and `suppliers` props from the component interface
- Remove the Department filter `Select` dropdown (lines 87-102)
- Remove the Supplier filter `Select` dropdown (lines 121-138)
- Remove `handleDepartmentChange` and `handleSupplierChange` handlers
- Update `hasActiveFilters` to exclude `department` and `supplierId`
- Remove unused imports (`Department`, `Supplier`)

**File: `src/components/admin/UserManagement.tsx`**
- Remove `departments` and `suppliers` props passed to `UserFiltersComponent`
- Remove `useDepartments` and `useSuppliers` imports (if no longer needed elsewhere -- `useSuppliers` is still used for `UserFormDialog`, so keep that)
- Remove `useDepartments` hook call since departments are no longer needed


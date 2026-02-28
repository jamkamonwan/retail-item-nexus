

## Fix Supplier Partner: Inline Creation + Layout Improvements

### Changes (all in `src/components/admin/SupplierGroupManagement.tsx`)

### 1. Replace "New Supplier Partner" popup with inline full-page creation screen

- Add `isCreating` state. When true, render a full-page view identical to the detail/edit view layout.
- The "New Supplier Partner" button sets `isCreating = true` and resets `editName`/`editDescription` to empty.
- The creation screen shows:
  - "Back to Groups" button
  - Card with Input for partner name, Textarea for description
  - "Save" button (calls `createGroup`, then navigates to the new group's detail view)
  - "Add Supplier" button (disabled until saved, or saves first then opens supplier dialog)
  - Empty supplier table placeholder
- Remove `formOpen` state and `SupplierGroupFormDialog` import/usage.

### 2. Fix detail view layout -- separate name/description from buttons

Currently the CardHeader uses `flex-row items-center justify-between` which crams Input/Textarea and buttons side-by-side.

New layout:
- Stack the header vertically: name input and description textarea at the top (full width)
- Buttons row below, right-aligned, with Save and Add Supplier
- Give the Input a `max-w-md` and Textarea a `max-w-lg` so they don't stretch the full card width
- This applies to both the creation screen and the existing detail/edit view

### Technical Details

**State changes:**
- Add: `isCreating: boolean` (default false)
- Remove: `formOpen`

**New creation view** (rendered before the list view check, after the detail view check):
```
if (isCreating) {
  return (
    // Same structure as detail view but with empty group data
    // Save creates the group and navigates to detail
  )
}
```

**Layout fix for CardHeader** (both create and detail views):
- Change from `flex flex-row items-center justify-between` to `flex flex-col space-y-4`
- Input gets `max-w-md` class
- Textarea gets `max-w-lg` class  
- Buttons in a separate `div` with `flex justify-end gap-2`

**Cleanup:**
- Remove `SupplierGroupFormDialog` import (line 6)
- Remove `handleFormSubmit` function
- Remove `<SupplierGroupFormDialog>` JSX (line 195)


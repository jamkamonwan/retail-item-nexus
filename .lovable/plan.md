

## Fix Supplier Partner Management - 3 Issues

### Issue 1: Add pencil icon back in list view Actions column
The pencil icon was removed but the user wants it back. Clicking it should navigate to the detail page (same as row click).

**Change in `SupplierGroupManagement.tsx` (list view Actions column, ~line 209-211):**
- Add a pencil icon button before the trash button that calls `setSelectedGroupId(g.id)` to navigate to the detail page

### Issue 2: Detail page should show editable name/description by default (no "Edit" button)
When navigating to the detail page, the name and description fields should always be editable inline -- no need to click an "Edit" button first.

**Changes in `SupplierGroupManagement.tsx` (detail view):**
- Remove the `isEditing` toggle logic entirely
- Always show `<Input>` for name and `<Textarea>` for description in the header
- Initialize `editName`/`editDescription` when `selectedGroupId` changes (use `useEffect` or initialize on selection)
- Replace the Edit/Save/Cancel buttons with just a "Save" button (always visible, disabled when name is empty) and the "Add Supplier" button
- On save, call `updateGroup` and show toast

### Issue 3: Double black overlay when opening "Add Supplier" dialog
The `GroupSupplierDialog` is rendered **twice** (lines 165-166 are duplicated). This causes a double overlay (two dialog overlays stacking = extra dark background).

**Fix:** Remove the duplicate `<GroupSupplierDialog>` on line 166.

### Technical Summary

**File: `src/components/admin/SupplierGroupManagement.tsx`**
1. List view: Add `<Pencil>` icon button in Actions column that navigates to detail page
2. Detail view: Remove `isEditing` state and conditional -- always render editable `<Input>`/`<Textarea>` for name/description, with a persistent Save button
3. Add a `useEffect` or handle in the selection setter to initialize `editName`/`editDescription` from the selected group
4. Remove duplicate `<GroupSupplierDialog>` (line 166)
5. Clean up unused `handleStartEdit`, `handleCancelEdit`, simplify `isEditing` state removal

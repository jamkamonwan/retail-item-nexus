

## Fix Supplier Partner Edit Flow

### What Changes

1. **List view -- Replace pencil icon with explicit "Edit" action that navigates to detail page**
   - In the list table Actions column, the pencil icon currently opens a popup dialog. Instead, clicking it should navigate to the detail/edit page for that group (same as clicking the row).
   - Remove the standalone pencil icon button from the Actions column since clicking the row already navigates to the detail page. Keep only the delete (trash) icon in Actions.

2. **Detail view -- Replace "Edit" popup with inline editing of partner name and description**
   - Currently, clicking "Edit" on the detail page opens `SupplierGroupFormDialog` (a popup). Instead, convert the detail view header into an editable state:
     - When user clicks "Edit", the partner name and description become editable input fields inline (no dialog).
     - Show "Save" and "Cancel" buttons to confirm or discard changes.
   - This allows editing the partner name directly on the detail page as shown in the mockup.

3. **Detail view -- Remove pencil icon from supplier rows**
   - The mockup shows no pencil/edit icon per supplier row. The user can use the existing "X" (remove) button and "Star" (main) toggle. Remove any per-row edit affordance if present (currently there is none beyond X and Star, so this is already correct).

### Technical Details

**File: `src/components/admin/SupplierGroupManagement.tsx`**

- Add `isEditing` state (`useState<boolean>(false)`) plus `editName` / `editDescription` state for inline editing.
- In the **detail view header**, when `isEditing` is true, render `<Input>` for name and `<Textarea>` for description instead of static text, with Save/Cancel buttons replacing Edit/Add Supplier.
- When `isEditing` is false, show the current static header with Edit and Add Supplier buttons (as now).
- On Save, call `updateGroup(selectedGroup.id, { name: editName, description: editDescription })` and set `isEditing(false)`.
- In the **list view Actions column**, remove the pencil `<Button>` -- keep only the trash icon. The row click already navigates to the detail page.
- Remove `SupplierGroupFormDialog` import and usage since editing will be inline. Keep it only for the "New Supplier Partner" creation flow (or also convert creation to inline -- but for now keep the dialog for creation since it's a simpler action).

**File: `src/components/admin/SupplierGroupFormDialog.tsx`**
- No changes needed -- still used for creating new partners.


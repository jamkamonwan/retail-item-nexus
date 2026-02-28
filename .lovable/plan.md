## Fix Detail Page Layout: Move Buttons Inline with Name

### Problem

The "Save" and "Add Supplier" buttons sit in a separate row below the name and description fields, creating excessive vertical space and an awkward layout.

### Solution

Restructure the `renderHeader` in `SupplierGroupManagement.tsx` so the **Supplier Partner Name input and buttons share the same row**, while the description stays on the row below.

### Layout Change

Current:

```text
[Label: Supplier Partner Name]  [Input ........................]    [Save] [Add Supplier]
[Label: Description]  [Textarea ....................] 

                   
```

New:

```text
[Label: Supplier Partner Name]  [Input ........................]    [Save] [Add Supplier]
[Label: Description]  [Textarea ....................] 
```

&nbsp;

&nbsp;

  


### Technical Details

**File: `src/components/admin/SupplierGroupManagement.tsx**` (lines 77-110, the `renderHeader` function)

- Wrap the name Input and action buttons in a single `flex items-end gap-2` row
- The Input stays inside its own `div` with `flex-1 max-w-md`
- Buttons sit at the end of that same row
- Description Textarea remains in a separate block below
- Tier badge (if present) stays below description
- This applies to both the creation and detail views since they share `renderHeader`
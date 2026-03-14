## Move Buttons to Top-Right Corner of Page

### Problem

The Save/Add Supplier buttons are buried below the form fields inside the card, wasting vertical space.

### Solution

Move the buttons out of the `renderHeader` card and into the top bar alongside the "Back to Groups" button, positioned on the right side. This eliminates a whole row inside the card and puts actions where users expect them.

### Layout Change

```text
Current:
[Back to Groups]
┌─────────────────────────────────┐
│ Supplier Partner Name           │
│ [Input ........................] │
│ Description                     │
│ [Textarea ....................] │
│              [Save] [Add Supplier] │
└─────────────────────────────────┘

New:
[Back to Groups]              [Save] [Add Supplier]
┌─────────────────────────────────┐
│ Supplier Partner Name           │
│ [Input ........................] │
│ Description                     │
│ [Textarea ....................] │
└─────────────────────────────────┘
```

### Technical Details

**File: `src/components/admin/SupplierGroupManagement.tsx**`

1. **Update `renderHeader**`: Remove the buttons div (lines 88-106) from inside the CardHeader. Only keep name input, description textarea, and tier badge.
2. **Update the creation view** (the `if (isCreating)` block): Change the top bar from just a back button to a `flex justify-between` row with back on left and Save/Auto Fill buttons on right.
3. **Update the detail view** (the `if (selectedGroup)` block): Same pattern -- back button on left, Save + Add Supplier buttons on right in the top bar.
4. The `renderHeader` function signature stays the same but the buttons are rendered outside of it, in the parent view's top navigation bar instead.  
|  
  
  
fix on When creat ethew new supplier partner   
move the button save  and autofill  on the right rop corner of page   
add the button add supplier also  in that  page 
5. &nbsp;


# User Story 1.2: Conditional Field Display Logic

## Overview

Implement smart conditional field visibility that reduces cognitive load for suppliers by showing only relevant fields based on department selection and field values. Following the optimization recommendation, we'll implement **8 essential conditionals** while converting remaining conditional fields to optional.

---

## Current State Analysis

### Existing Conditionals in Codebase

The current implementation has:
- Division-based filtering via `applicableDivisions` (already working)
- `conditionalOn` property defined on some fields but **not yet implemented in the UI**

### Gap Analysis

| Feature | Current State | Required |
|---------|---------------|----------|
| Division filtering | Working | Keep |
| `conditionalOn` field logic | Defined but not evaluated | Implement |
| Visual indicators for appearing/disappearing fields | None | Add animation |
| Trigger-based field visibility | Not implemented | Build |

---

## 8 Essential Conditionals to Implement

| # | Trigger Field | Dependent Field | Condition | Division Scope |
|---|---------------|-----------------|-----------|----------------|
| 1 | `tisi_number` | `image_tisi` | Show when TISI number is filled | HL, HOL, GS |
| 2 | `fda_number` | `image_fda` | Show when FDA number is filled | DF, FF, HB, PH |
| 3 | `department` | `image_size_chart` | Show when department is SL | SL only |
| 4 | `group_by` | `group_name` | Show when "Group by" is selected | HL, HOL, SL, NF |
| 5 | `group_by` | `sku_reference` | Show when "Group by" is selected | HL, HOL, SL, NF |
| 6 | `group_by` | `group_barcode` | Show when "Group by" is selected | HL, HOL, SL, NF |
| 7 | `color` | `hex_color_code` | Show when color is filled | SL, HL, GS, HB |
| 8 | `size` | `size_standard` | Show when size is filled | SL |

---

## Technical Implementation

### Phase 1: Add Missing Fields

Add new fields to `src/data/npd-fields-supplier.ts`:

```typescript
// New fields for grouping (Product Identification section)
{
  id: 'group_by',
  name: 'Group By',
  nameTh: 'จัดกลุ่มโดย',
  requirement: 'optional',
  inputType: 'dropdown',
  dropdownOptions: ['None', 'Color', 'Size', 'Pattern'],
  applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
},
{
  id: 'group_name',
  name: 'Group Name',
  nameTh: 'ชื่อกลุ่ม',
  requirement: 'conditional',
  conditionalOn: 'group_by:!None', // Show if group_by is not "None"
},
{
  id: 'sku_reference',
  name: 'SKU Reference',
  nameTh: 'อ้างอิง SKU',
  requirement: 'conditional',
  conditionalOn: 'group_by:!None',
},
{
  id: 'group_barcode',
  name: 'Group Barcode',
  nameTh: 'บาร์โค้ดกลุ่ม',
  requirement: 'conditional',
  conditionalOn: 'group_by:!None',
},

// New fields for color/size (Basic Attributes section)
{
  id: 'hex_color_code',
  name: 'Hex Color Code',
  nameTh: 'รหัสสี Hex',
  requirement: 'conditional',
  conditionalOn: 'color', // Show when color has value
  placeholder: '#FFFFFF',
},
{
  id: 'size_standard',
  name: 'Size Standard',
  nameTh: 'มาตรฐานไซส์',
  requirement: 'conditional',
  conditionalOn: 'size', // Show when size has value
  inputType: 'dropdown',
  dropdownOptions: ['Thai Standard', 'US Standard', 'EU Standard', 'UK Standard', 'Asian Standard'],
  applicableDivisions: ['SL'],
},
```

### Phase 2: Conditional Logic Engine

Create a new utility in `src/utils/conditional-fields.ts`:

```typescript
interface ConditionalRule {
  fieldId: string;
  dependsOn: string;
  condition: 'has_value' | 'equals' | 'not_equals';
  value?: string;
}

const CONDITIONAL_RULES: ConditionalRule[] = [
  { fieldId: 'image_tisi', dependsOn: 'tisi_number', condition: 'has_value' },
  { fieldId: 'image_fda', dependsOn: 'fda_number', condition: 'has_value' },
  { fieldId: 'tisi_expiry', dependsOn: 'tisi_number', condition: 'has_value' },
  { fieldId: 'fda_expiry', dependsOn: 'fda_number', condition: 'has_value' },
  { fieldId: 'group_name', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  { fieldId: 'sku_reference', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  { fieldId: 'group_barcode', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  { fieldId: 'hex_color_code', dependsOn: 'color', condition: 'has_value' },
  { fieldId: 'size_standard', dependsOn: 'size', condition: 'has_value' },
];

export function evaluateCondition(
  rule: ConditionalRule,
  formData: Record<string, any>
): boolean {
  const triggerValue = formData[rule.dependsOn];
  
  switch (rule.condition) {
    case 'has_value':
      return triggerValue && String(triggerValue).trim() !== '';
    case 'equals':
      return triggerValue === rule.value;
    case 'not_equals':
      return triggerValue !== rule.value && triggerValue !== '' && triggerValue !== null;
    default:
      return true;
  }
}

export function getVisibleFields(
  fields: NPDFormField[],
  formData: Record<string, any>,
  division: Division
): NPDFormField[] {
  return fields.filter(field => {
    // First check division applicability
    if (field.applicableDivisions !== 'all' && 
        !field.applicableDivisions.includes(division)) {
      return false;
    }
    
    // Then check conditional rules
    const rule = CONDITIONAL_RULES.find(r => r.fieldId === field.id);
    if (rule) {
      return evaluateCondition(rule, formData);
    }
    
    return true;
  });
}
```

### Phase 3: Update NPDForm.tsx

Modify the `currentFields` useMemo to apply conditional filtering:

```typescript
import { getVisibleFields } from '@/utils/conditional-fields';

const currentFields = useMemo(() => {
  if (!selectedDivision) return [];
  
  const sectionFields = getFieldsForSectionAndDivision(currentSection, selectedDivision);
  return getVisibleFields(sectionFields, formData, selectedDivision);
}, [selectedDivision, currentSection, formData]);
```

### Phase 4: Update FormSection.tsx

Add visual indicators and animations for conditional fields:

```typescript
// Add animation wrapper for conditional fields
<div
  className={cn(
    'transition-all duration-300 ease-in-out',
    field.requirement === 'conditional' && 'animate-in fade-in slide-in-from-top-2'
  )}
>
  <FormField ... />
</div>

// Update conditional fields header with indicator
{conditionalFields.length > 0 && (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-warning font-bold">◇</span>
    <span className="text-sm text-muted-foreground">
      Conditional Fields ({conditionalFields.length} shown based on your entries)
    </span>
    <Sparkles className="w-4 h-4 text-warning animate-pulse" />
  </div>
)}
```

### Phase 5: Convert Remaining Conditionals to Optional

Update these fields from `requirement: 'conditional'` to `requirement: 'optional'` with visibility always on:

| Field ID | Current Requirement | New Requirement |
|----------|---------------------|-----------------|
| `shelf_life_days` | conditional | optional |
| `storage_condition` | conditional | optional |
| `storage_temp` | conditional | optional |
| `ingredients` | conditional | optional |
| `allergen_info` | conditional | optional |
| `nutrition_info` | conditional | optional |
| `warning_text` | conditional | optional |
| `halal_cert` | conditional | optional |
| `material` | conditional | optional |
| `product_license` | conditional | optional |
| `season_code` | conditional | optional |

Note: These fields will still be filtered by `applicableDivisions`, just not by value-based triggers.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/utils/conditional-fields.ts` | **Create** - Conditional logic engine |
| `src/data/npd-fields-supplier.ts` | Add 6 new fields, update 11 fields from conditional to optional |
| `src/components/npd/NPDForm.tsx` | Integrate conditional filtering in useMemo |
| `src/components/npd/FormSection.tsx` | Add animations and visual indicators |
| `src/index.css` | Add animation classes if needed |

---

## UI/UX Enhancements

### Visual Indicators

```
+----------------------------------------------------+
|  Conditional Fields                                 |
|  ◇ Shown based on your entries                     |
|  ┌─────────────────────────────────────────────┐   |
|  │ ✨ New field appeared!                       │   |
|  │                                              │   |
|  │   Hex Color Code (รหัสสี Hex)               │   |
|  │   [#FFFFFF                              ]   │   |
|  │   Triggered by: Color field                 │   |
|  └─────────────────────────────────────────────┘   |
+----------------------------------------------------+
```

### Animations

- **Field appearing**: Fade in + slide down (300ms ease-in-out)
- **Field disappearing**: Fade out + slide up (200ms)
- **Sparkle icon**: Subtle pulse animation on conditional section header

---

## Validation Logic Update

Update validation to only require conditional fields when they are visible:

```typescript
const validateCurrentSection = (): boolean => {
  const newErrors: Record<string, string> = {};
  const visibleFields = getVisibleFields(currentFields, formData, selectedDivision);
  
  visibleFields.forEach(field => {
    // Only validate visible mandatory fields
    if (field.requirement === 'mandatory') {
      const value = formData[field.id];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.id] = `${field.name} is required`;
      }
    }
    
    // Conditional fields become mandatory when visible
    if (field.requirement === 'conditional') {
      const value = formData[field.id];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.id] = `${field.name} is required when triggered`;
      }
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## Testing Scenarios

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TISI Trigger | 1. Select HL division 2. Fill TISI number | image_tisi field appears with animation |
| FDA Trigger | 1. Select PH division 2. Fill FDA number | image_fda field appears |
| Size Chart Auto-show | 1. Select SL division | image_size_chart always visible |
| Group Fields | 1. Select HL 2. Set Group By = "Color" | 3 group fields appear together |
| Color Trigger | 1. Select SL 2. Fill Color field | hex_color_code appears |
| Field Hide | 1. Clear TISI number after filling | image_tisi disappears smoothly |

---

## Benefits

1. **Reduced cognitive load**: 8 smart conditionals vs 23 complex ones
2. **Faster development**: 1 week saved per optimization recommendation
3. **Better UX**: Clear visual feedback when fields appear/disappear
4. **Maintainable code**: Centralized conditional logic in utility file
5. **Division-aware**: Respects product category context


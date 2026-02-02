
# Update Field Definitions and Column Layout Based on Excel Spec

## Overview

Update the NPD form field definitions and section structure to align with the **Field_Spec_List_Grouped.xlsx** specification. This includes restructuring from 6 sections to 7 sections and updating field counts based on the Excel data.

---

## Key Changes from Excel Analysis

### Section Structure Comparison

| Section | Current Code | Excel Spec | Change |
|---------|-------------|------------|--------|
| 1. Product Identification | 15 fields | 24 fields | +9 fields |
| 2. Product Images | 7 fields | 10 fields | +3 fields |
| 3. Basic Attributes | 20 fields | 109 fields | +89 fields |
| 4. Compliance & Certification | 10 fields | 17 fields | +7 fields |
| 5. Pricing Basics | 8 fields | 10 fields | +2 fields |
| 6. Logistics & Supply Chain | 20 fields | 107 fields | +87 fields |
| 7. System Fields | ❌ Missing | 9 fields | **NEW** |
| **Total** | 80 fields | 286 fields | +206 fields |

---

## Phase 1: Update Types Definition

Add the new "System Fields" section to `src/types/npd.ts`:

```typescript
export type SupplierFormSection = 
  | 'product_identification'
  | 'product_images'
  | 'basic_attributes'
  | 'compliance'
  | 'pricing'
  | 'logistics'
  | 'system_fields';  // NEW

export const SUPPLIER_FORM_SECTIONS: Record<SupplierFormSection, {...}> = {
  // ... existing sections ...
  system_fields: {
    title: 'System Fields',
    titleTh: 'ระบบและการจัดการ',
    icon: 'settings',
    fieldCount: 9,
  },
};

export const SUPPLIER_FORM_STEPS: SupplierFormSection[] = [
  'product_identification',
  'product_images',
  'basic_attributes',
  'compliance',
  'pricing',
  'logistics',
  'system_fields',  // NEW
];
```

---

## Phase 2: Column Layout Adjustment

The Excel shows that sections have varying field counts:
- Small sections (10-24 fields): 2 columns works well
- Large sections (100+ fields): Consider sub-grouping

**Recommended column layout strategy:**

| Section | Field Count | Recommended Layout |
|---------|-------------|-------------------|
| Product Identification | 24 | 2 columns |
| Product Images | 10 | 2 columns (images full-width) |
| Basic Attributes | 109 | 2 columns with sub-groups |
| Compliance | 17 | 2 columns |
| Pricing | 10 | 2 columns |
| Logistics | 107 | 2 columns with sub-groups |
| System Fields | 9 | 2 columns |

The current 2-column layout (`grid-cols-1 md:grid-cols-2`) is appropriate for consistency between Supplier and Reviewer views.

---

## Phase 3: Add New Fields from Excel

Key new fields to add per section based on Excel analysis:

### Section 1: Product Identification (+9 fields)
- Article (IM)
- Brand Code (Auto)
- Product Group HALAL/LOCAL/HEALTHY/TOURIST (Buyer)
- Seller (Supplier/Buyer Review)
- Group By (Supplier)
- Group Name (Supplier, conditional)
- SKU Reference (Supplier, conditional)
- Group Barcode (Buyer, conditional)
- Quantity Coeff / Barcode (PH/DF only)

### Section 2: Product Images (+3 fields)
- YouTube Link
- Picture+image name
- Link to additional data and images

### Section 3: Basic Attributes (+89 fields)
Large section with filters, dimensions, pack info, etc.
Key sub-groups:
- Dimensions (Piece, Pack, Inner)
- Filters (Watt, BTU, Capacity, etc.)
- Clothing attributes (Size, Waist, etc.)
- Food attributes (Ingredients, Allergens)

### Section 4: Compliance (+7 fields)
- FDA/อย. numbers
- TISI/มอก. numbers
- Size standards
- Safety Stock

### Section 5: Pricing (+2 fields)
- POSA Gift Card
- POSA Commission

### Section 6: Logistics (+87 fields)
Large section with:
- DC allowances per format
- Forecast sales per format
- Attribute codes per format
- DC delivery settings

### Section 7: System Fields (NEW - 9 fields)
- LV
- Pog_Round
- New Item / Join Item / Re-Active
- Extra Info
- Import Product Type
- PLM/Import
- Remark (Online/Offline)
- Condition/Remark

---

## Phase 4: Files to Modify

| File | Changes |
|------|---------|
| `src/types/npd.ts` | Add `system_fields` section, update `SUPPLIER_FORM_STEPS` |
| `src/data/npd-fields-supplier.ts` | Add new fields for all sections based on Excel |
| `src/components/npd/SubmissionView.tsx` | Add Settings icon for system_fields section |

---

## Phase 5: SubmissionView Icon Update

Add icon for new system_fields section:

```typescript
import { Settings } from 'lucide-react';

const getSectionIcon = (section: SupplierFormSection) => {
  switch (section) {
    // ... existing cases ...
    case 'system_fields':
      return Settings;
    default:
      return Package;
  }
};
```

---

## Implementation Priority

Given the large number of new fields (206+), I recommend a phased approach:

1. **Immediate**: Add `system_fields` section structure and 9 fields
2. **Next**: Add critical missing fields per section (priority fields)
3. **Later**: Complete all 286 fields from Excel

---

## Summary

This update will:
1. Add new "System Fields" section (7 sections total)
2. Keep consistent 2-column layout for both Supplier and Reviewer views
3. Add field definitions from Excel specification
4. Update section icons and navigation

Should I proceed with the full implementation or start with just the structural changes (adding the 7th section)?

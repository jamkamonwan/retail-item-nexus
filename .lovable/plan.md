

# Revise Field Layout and Add Online Channel Indicators

## Overview

This plan updates the NPD form screens to align with the Excel specification (`Field_Spec_List_Grouped-2.xlsx`) by:
1. Restructuring fields per the 7 categories defined in Excel
2. Adding visual indicators to show which fields are for "Online" channel

---

## Key Findings from Excel Analysis

### Channel Column Classification

The Excel defines three channel types per field:

| Channel Type | Meaning | Visual Indicator |
|-------------|---------|------------------|
| `Offline Column` | Store/offline use only | No badge |
| `Online Column` | Online channel only | **"Online" badge** |
| `Offline/Online Column` | Both channels | **"Both" badge** (or none) |

### Section Field Counts (Verified)

| Section | Fields | Current Status |
|---------|--------|----------------|
| 1. Product Identification | 24 | Types updated |
| 2. Product Images | 10 | Types updated |
| 3. Basic Attributes | 109 | Types updated |
| 4. Compliance & Certification | 17 | Types updated |
| 5. Pricing Basics | 10 | Types updated |
| 6. Logistics & Supply Chain | 107 | Types updated |
| 7. System Fields | 9 | Types updated |

---

## Phase 1: Update NPDFormField Interface

Add a new `channelType` property to distinguish channel assignment:

```typescript
// In src/types/npd.ts
export type ChannelColumn = 'offline' | 'online' | 'both';

export interface NPDFormField {
  // ... existing fields ...
  channelColumn?: ChannelColumn; // NEW: Indicates if field is online-only, offline-only, or both
}
```

---

## Phase 2: Add Online Badge to FormField Component

Update `src/components/npd/FormField.tsx` to show channel badges:

```text
┌────────────────────────────────────────────────────────────────┐
│ * Brand Name (แบรนด์)  [🌐 Online+Offline]   [?]              │
├────────────────────────────────────────────────────────────────┤
│ [_____________________________________________]                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ * Category (หมวดสินค้า)  [🛒 Online Only]   [?]               │
├────────────────────────────────────────────────────────────────┤
│ [Select Category ▼]                                            │
└────────────────────────────────────────────────────────────────┘
```

**Badge Styling:**
- **Online Only**: Green badge with globe icon: `"🌐 Online"`
- **Both Channels**: Blue badge: `"📦 Offline+Online"` (or can be hidden as it's the common case)
- **Offline Only**: No badge (default, for store-only fields)

---

## Phase 3: Update Field Definitions with Channel Data

Update `src/data/npd-fields-supplier.ts` to add `channelColumn` property based on Excel:

**Sample updates from Excel mapping:**

| Field | Excel Channel | channelColumn |
|-------|--------------|---------------|
| Article | Offline Column | `'offline'` |
| Brand Name | Offline/Online Column | `'both'` |
| Model | Offline/Online Column | `'both'` |
| Group By (จัดกลุ่มโดย) | Online Column | `'online'` |
| Category (หมวดสินค้า) | Online Column | `'online'` |
| SKU Reference | Online Column | `'online'` |
| Group Name | Online Column | `'online'` |
| YouTube Link | Online Column | `'online'` |
| Picture+image name | Online Column | `'online'` |
| All product images | Online Column | `'online'` |
| Most filter fields | Online Column | `'online'` |

---

## Phase 4: Update FormSection to Group by Channel (Optional)

Consider adding a channel filter or grouping in the section display:

```text
┌─────────────────────────────────────────────────────────────────┐
│ 3. Basic Attributes (คุณลักษณะพื้นฐาน)                          │
├─────────────────────────────────────────────────────────────────┤
│ [All] [🌐 Online Fields] [📦 Offline Fields]    ← Tab filter   │
├─────────────────────────────────────────────────────────────────┤
│ REQUIRED FIELDS (15 fields)                                    │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐
│ │ * Size [🌐 Online+Offline]  │ │ * Weight (kg) [Offline]     │
│ └──────────────────────────────┘ └──────────────────────────────┘
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 5: Files to Modify

| File | Changes |
|------|---------|
| `src/types/npd.ts` | Add `ChannelColumn` type and `channelColumn` property to `NPDFormField` |
| `src/data/npd-fields-supplier.ts` | Add `channelColumn` property to all fields based on Excel |
| `src/components/npd/FormField.tsx` | Add channel badge display (🌐 Online, etc.) |
| `src/components/npd/FormSection.tsx` | Optionally add channel filter tabs |
| `src/components/npd/SubmissionView.tsx` | Show channel badges in review view |

---

## Phase 6: Badge Component Implementation

Add a reusable channel badge:

```typescript
// Inside FormField.tsx
const ChannelBadge = ({ channel }: { channel?: ChannelColumn }) => {
  if (!channel || channel === 'offline') return null; // No badge for offline-only
  
  if (channel === 'online') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Globe className="w-3 h-3 mr-1" />
        Online
      </Badge>
    );
  }
  
  if (channel === 'both') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <ShoppingCart className="w-3 h-3 mr-1" />
        All Channels
      </Badge>
    );
  }
  
  return null;
};
```

---

## Excel-to-Code Field Mapping Summary

Based on Excel analysis, here are the key online-only fields to update:

### Section 1: Product Identification (Online Fields)
- Group By (จัดกลุ่มโดย)
- Category (หมวดสินค้า)
- SKU Reference
- Group Name
- Group Barcode
- Seller

### Section 2: Product Images (Online Fields)
- YouTube Link
- Picture+image name
- Link to additional data and images
- All images 1-7 (front, back, side, zoom, TISI, FDA, size chart)

### Section 3: Basic Attributes (Online Fields - partial list)
- Filter Watt, BTU, Capacity, PM2.5, etc.
- Warranty (TH/EN)
- Condition/Remark
- Ingredients, Allergens
- Color/Shade, Hex Code
- Gender, Age Range
- Package dimensions
- And many more...

### Section 6: Logistics (Online Fields)
- Shipping Methods
- Max qty per order
- Extra Service
- Filter Grill Mode

### Section 7: System Fields (Online Fields)
- Condition/Remark (Thai)
- Remark (Online)

---

## Implementation Priority

1. **Immediate**: Add `channelColumn` type and update FormField with badge
2. **Next**: Update all field definitions with correct `channelColumn` values from Excel
3. **Optional**: Add channel filter tabs in FormSection

---

## Summary

This update will:
1. Add visual "🌐 Online" badges to indicate which fields are for online channel
2. Align field structure with the Excel specification categories
3. Help users understand which data is needed for e-commerce vs store operations
4. Maintain consistent 2-column layout while adding channel context


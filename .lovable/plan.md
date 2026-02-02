
# Align Reviewer View with Supplier Form Layout

## Overview

Update the reviewer/approver submission view (`SubmissionView.tsx`) to match the supplier form's look and feel while adding role-based field ownership indicators. Reviewers (Buyer, Commercial, Finance, Admin) will see the same 6-section structure with horizontal tabs, color-coded fields by role ownership, and clear edit/view-only indicators.

---

## Current vs Target State

| Aspect | Current State | Target State (per mockups) |
|--------|---------------|----------------------------|
| Navigation | 7 legacy tabs (basic_info, etc.) | 6 horizontal tabs matching supplier sections |
| Sections | Old section names | Product Identification, Product Images, Basic Attributes, Compliance, Pricing, Logistics |
| Field Cards | Simple input display | Color-coded left border by role owner |
| Role Indicators | Badge at bottom | "SUPPLIER" badge + lock icon position |
| Edit/View Legend | Simple icons | Prominent legend bar with role colors |
| Field Count | Not shown | Show count badge on each tab |

---

## Visual Design Reference

From the uploaded mockups:

```text
+------------------------------------------------------------------+
| ← Back to List   น้ำส้มคั้นสด 100%  [DF] [Draft]                   |
|------------------------------------------------------------------|
| ● Supplier fields  ● Buyer fields  ● Commercial  ● Finance       |
|                                        ✎ Editable    🔒 View only |
|------------------------------------------------------------------|
| [Basic Info] [Product Images] [Specs] [Dims] [Pricing] [Compliance] [Logistics] |
|------------------------------------------------------------------|
| Product Images                                                    |
| รูปภาพสินค้า                                                       |
|                                                                   |
| ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   |
| │ Front View *  🔒 │ │ Back View *   🔒 │ │ Side View     🔒 │   |
| │ รูปด้านหน้า      │ │ รูปด้านหลัง      │ │ รูปด้านข้าง      │   |
| │                  │ │                  │ │                  │   |
| │ [No image]       │ │ [No image]       │ │ [No image]       │   |
| │                  │ │                  │ │                  │   |
| │ [SUPPLIER]       │ │ [SUPPLIER]       │ │ [SUPPLIER]       │   |
| └──────────────────┘ └──────────────────┘ └──────────────────┘   |
+------------------------------------------------------------------+
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/npd/SubmissionView.tsx` | Complete restructure to match supplier form layout |
| `src/data/npd-fields-supplier.ts` | Add helper to get all fields grouped by new sections |
| `src/index.css` | Add role ownership color classes for left borders |

---

## Phase 1: Update Section Structure

Replace legacy `FORM_STEPS` with new supplier sections:

```typescript
// Change from:
const FORM_STEPS: FormSection[] = ['basic_info', 'product_images', ...];

// To:
import { SUPPLIER_FORM_STEPS, SUPPLIER_FORM_SECTIONS, SupplierFormSection } from '@/types/npd';
import { getFieldsForSectionAndDivision } from '@/data/npd-fields-supplier';
```

---

## Phase 2: Role Color Mapping

Create consistent role color scheme:

| Role | Color | Border Class | Dot Class |
|------|-------|--------------|-----------|
| Supplier | Orange (#F97316) | `border-l-orange-500` | `bg-orange-500` |
| Buyer | Blue (#2563EB) | `border-l-blue-600` | `bg-blue-600` |
| Commercial | Purple (#9333EA) | `border-l-purple-600` | `bg-purple-600` |
| Finance | Amber (#D97706) | `border-l-amber-600` | `bg-amber-600` |
| SCM/IM/DC | Indigo (#4F46E5) | `border-l-indigo-500` | `bg-indigo-500` |

---

## Phase 3: Enhanced Field Cards

Each field card should display:
1. **Left border** - Color based on field owner role
2. **Lock icon** (top-right) - For view-only fields
3. **Field label** with Thai translation
4. **Role badge** (bottom-left) - Shows primary owner (e.g., "SUPPLIER")
5. **Mandatory indicator** - Red asterisk for required fields

```text
┌─────────────────────────────┐
│ Front View *            🔒  │  ← Lock for view-only
│ รูปด้านหน้า                  │  ← Thai translation
│                             │
│ [Image preview / upload]    │
│                             │
│ [SUPPLIER]                  │  ← Role badge
└─────────────────────────────┘
   ↑ Orange left border (supplier field)
```

---

## Phase 4: Tab Navigation with Counts

Update tabs to show section field counts:

```typescript
<TabsTrigger value="product_identification">
  Product Identification
  <span className="ml-2 text-xs bg-muted px-1.5 rounded">15</span>
</TabsTrigger>
```

---

## Phase 5: Enhanced Role Legend

Update the legend bar to match mockup design:

```typescript
<div className="flex items-center justify-between py-4 px-6 bg-card border-b">
  {/* Role color dots */}
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-orange-500" />
      <span className="text-sm">Supplier fields</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-blue-600" />
      <span className="text-sm">Buyer fields</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-purple-600" />
      <span className="text-sm">Commercial fields</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-amber-600" />
      <span className="text-sm">Finance fields</span>
    </div>
  </div>
  
  {/* Edit indicators */}
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Edit3 className="w-4 h-4" />
      Editable by you
    </div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Lock className="w-4 h-4" />
      View only
    </div>
  </div>
</div>
```

---

## Phase 6: CSS Role Border Classes

Add to `src/index.css`:

```css
/* Role ownership field borders */
.field-owner-supplier { @apply border-l-4 border-l-orange-500; }
.field-owner-buyer { @apply border-l-4 border-l-blue-600; }
.field-owner-commercial { @apply border-l-4 border-l-purple-600; }
.field-owner-finance { @apply border-l-4 border-l-amber-600; }
.field-owner-scm,
.field-owner-im,
.field-owner-dc_income { @apply border-l-4 border-l-indigo-500; }
```

---

## Field Rendering Logic

Determine field owner color based on `assignedTo` array:

```typescript
const getFieldOwnerClass = (assignedTo: UserType[]): string => {
  // Priority order: supplier > buyer > commercial > finance > other
  if (assignedTo.includes('supplier')) return 'field-owner-supplier';
  if (assignedTo.includes('buyer')) return 'field-owner-buyer';
  if (assignedTo.includes('commercial')) return 'field-owner-commercial';
  if (assignedTo.includes('finance')) return 'field-owner-finance';
  return 'field-owner-supplier'; // default
};

const getFieldOwnerLabel = (assignedTo: UserType[]): string => {
  if (assignedTo.includes('supplier')) return 'SUPPLIER';
  if (assignedTo.includes('buyer')) return 'BUYER';
  if (assignedTo.includes('commercial')) return 'COMMERCIAL';
  if (assignedTo.includes('finance')) return 'FINANCE';
  return assignedTo[0]?.toUpperCase() || 'UNKNOWN';
};
```

---

## Image Field Display

For file/image fields, show:
- Image preview if uploaded
- Placeholder with icon if not uploaded
- Same card styling with role border

```typescript
{field.inputType === 'file' ? (
  <div className="w-full h-40 bg-muted/30 rounded-lg flex flex-col items-center justify-center border border-dashed">
    {value instanceof File ? (
      <ImagePreview file={value} fieldName={field.name} />
    ) : (
      <>
        <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">No image uploaded</span>
      </>
    )}
  </div>
) : ...}
```

---

## Key Differences from Supplier Form

| Feature | Supplier Form | Reviewer View |
|---------|---------------|---------------|
| Navigation | Vertical sidebar | Horizontal tabs |
| Editing | All fields editable | Role-based edit/view |
| Progress | Step-by-step wizard | All sections viewable |
| Auto-fill | Available | Not available |
| Submit button | Present | Approve/Reject/Revise actions |

---

## Benefits

1. **Consistent UX**: Reviewers see data in same structure as supplier entered it
2. **Clear ownership**: Color-coded fields show who is responsible
3. **Role awareness**: Lock icons and badges clarify what current user can edit
4. **Bilingual support**: Thai translations visible throughout
5. **Scalable**: Works with all 80 fields across 6 sections

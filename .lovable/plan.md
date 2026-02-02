

# Align Reviewer View Layout with Supplier Form (Vertical Sidebar)

## Problem

The current Reviewer View (`SubmissionView.tsx`) uses **horizontal tabs** for section navigation, but the user expects it to have a **vertical sidebar** matching the Supplier Form layout.

---

## Current vs Target Layout

| Component | Current (Reviewer View) | Target (Same as Supplier) |
|-----------|------------------------|---------------------------|
| Navigation | Horizontal tabs at top | Vertical sidebar on left |
| Layout | Single column with tabs | Two-column (sidebar + content) |
| Section display | Tab switching | Click sidebar items |
| Field count | In tab badges | In sidebar items |

---

## Visual Reference

**Supplier Form Layout (Target):**
```text
┌─────────────────────────────────────────────────────────────────┐
│ ← Back        [DF] [food]  SUPPLIER • 80 Fields     [Save][↺]   │
├──────────────────┬──────────────────────────────────────────────┤
│ Form Sections(6) │                                              │
│                  │  Section 1 of 6 • 15 fields    [Auto Fill]  │
│ ┌──────────────┐ │                                              │
│ │ ● Product ID │ │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │   ข้อมูลระบุ  │ │  │ Field 1 │ │ Field 2 │ │ Field 3 │        │
│ └──────────────┘ │  └─────────┘ └─────────┘ └─────────┘        │
│                  │                                              │
│   ○ Images       │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│   รูปภาพ      7  │  │ Field 4 │ │ Field 5 │ │ Field 6 │        │
│                  │  └─────────┘ └─────────┘ └─────────┘        │
│   ○ Attributes   │                                              │
│   คุณสมบัติ   20 │  [Previous]                      [Next →]   │
│                  │                                              │
│   ○ Compliance   │                                              │
│   การรับรอง   10 │                                              │
│                  │                                              │
│   ○ Pricing      │                                              │
│   ราคา        8  │                                              │
│                  │                                              │
│   ○ Logistics    │                                              │
│   โลจิสติกส์  20 │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/npd/SubmissionView.tsx` | Replace horizontal tabs with vertical sidebar layout |

---

## Phase 1: Layout Structure Change

Replace the current horizontal `Tabs` component with a two-column flex layout:

```typescript
// FROM:
<Tabs defaultValue="product_identification">
  <TabsList>...</TabsList>
  {SUPPLIER_FORM_STEPS.map(section => (
    <TabsContent key={section} value={section}>...</TabsContent>
  ))}
</Tabs>

// TO:
<div className="flex gap-6">
  {/* Sidebar */}
  <aside className="hidden lg:block w-72 shrink-0">
    <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Form Sections (6)
      </h3>
      <ProgressStepper
        steps={SUPPLIER_FORM_STEPS}
        currentStep={currentSectionIndex}
        completedSteps={[]}
        onStepClick={handleSectionClick}
        sectionInfo={SUPPLIER_FORM_SECTIONS}
      />
    </div>
  </aside>
  
  {/* Main Content */}
  <main className="flex-1 min-w-0">
    {/* Current section content */}
  </main>
</div>
```

---

## Phase 2: State Management

Add state to track the currently selected section:

```typescript
const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
const currentSection = SUPPLIER_FORM_STEPS[currentSectionIndex];

const handleSectionClick = (stepIndex: number) => {
  setCurrentSectionIndex(stepIndex);
};
```

---

## Phase 3: Render Current Section Content

Render only the selected section's fields (like the supplier form does):

```typescript
<main className="flex-1 min-w-0">
  {/* Mobile Section Stepper */}
  <div className="lg:hidden mb-6">
    <ProgressStepper
      steps={SUPPLIER_FORM_STEPS}
      currentStep={currentSectionIndex}
      completedSteps={[]}
      onStepClick={handleSectionClick}
      sectionInfo={SUPPLIER_FORM_SECTIONS}
    />
  </div>

  {/* Section Content Card */}
  <Card>
    <CardHeader>
      <CardTitle>{SUPPLIER_FORM_SECTIONS[currentSection].title}</CardTitle>
      <CardDescription>{SUPPLIER_FORM_SECTIONS[currentSection].titleTh}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fieldsBySection[currentSection]?.map(field => (
          /* Field cards with role-based styling */
        ))}
      </div>
    </CardContent>
  </Card>
  
  {/* Section Navigation */}
  <div className="flex items-center justify-between mt-6">
    <Button
      variant="outline"
      onClick={() => setCurrentSectionIndex(prev => prev - 1)}
      disabled={currentSectionIndex === 0}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Previous
    </Button>
    <Button
      onClick={() => setCurrentSectionIndex(prev => prev + 1)}
      disabled={currentSectionIndex === SUPPLIER_FORM_STEPS.length - 1}
    >
      Next
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </div>
</main>
```

---

## Phase 4: Import ProgressStepper Component

Add the import and use the same stepper component as the supplier form:

```typescript
import { ProgressStepper } from './ProgressStepper';
```

---

## Key Components Reused

| Component | Purpose |
|-----------|---------|
| `ProgressStepper` | Vertical sidebar navigation with icons, titles, Thai text |
| `SUPPLIER_FORM_STEPS` | Array of 6 section keys |
| `SUPPLIER_FORM_SECTIONS` | Section metadata (title, titleTh, fieldCount) |

---

## Responsive Behavior

- **Desktop (lg and up)**: Vertical sidebar on left + main content on right
- **Mobile/Tablet**: Horizontal scrollable stepper on top + main content below (same as supplier form)

---

## Summary of Changes

1. Replace horizontal `Tabs/TabsList/TabsContent` with flex layout
2. Add `ProgressStepper` component in sidebar (same as NPDForm)
3. Add section index state to track current section
4. Add Previous/Next navigation buttons
5. Keep all role-based field styling (color borders, lock icons, role badges)




# Apply Big C Retail Theme to NPD Application

## Overview

Transform the current NPD application's visual design to match the Big C Thailand retail website theme. This involves updating the color scheme, adding a branded header with search functionality, and applying the characteristic green/red/yellow color palette throughout the application.

---

## Visual Analysis of Big C Theme

Based on the reference image, the Big C design features:

| Element | Description | Color Values |
|---------|-------------|--------------|
| Primary Green | Bright lime green background | `hsl(100, 80%, 50%)` |
| Red Accent | Big C logo red, promotional highlights | `hsl(0, 80%, 50%)` |
| Yellow/Orange | Promotional badges, CTAs | `hsl(45, 100%, 50%)` |
| White | Cards, clean surfaces | `hsl(0, 0%, 100%)` |
| Dark Text | High contrast text | `hsl(0, 0%, 15%)` |

---

## Phase 1: Update CSS Variables in `src/index.css`

Update the `:root` color scheme to match Big C branding:

```css
:root {
  /* Core Background - Light off-white */
  --background: 100 20% 98%;
  --foreground: 0 0% 15%;

  /* Primary - Big C Red */
  --primary: 0 80% 50%;
  --primary-foreground: 0 0% 100%;

  /* Secondary - Light green tint */
  --secondary: 100 40% 95%;
  --secondary-foreground: 100 60% 25%;

  /* Accent - Big C Green (for CTAs, highlights) */
  --accent: 100 70% 45%;
  --accent-foreground: 0 0% 100%;

  /* Success - Promotional Green */
  --success: 100 70% 45%;
  --success-foreground: 0 0% 100%;

  /* Warning - Yellow promotional badges */
  --warning: 45 100% 50%;
  --warning-foreground: 0 0% 15%;

  /* Sidebar - Big C Green theme */
  --sidebar-background: 100 70% 40%;
  --sidebar-foreground: 0 0% 100%;
  --sidebar-primary: 0 80% 50%;
  --sidebar-accent: 100 70% 50%;
}
```

---

## Phase 2: Create Branded Header Component

Create new header component `src/components/layout/BigCHeader.tsx`:

```text
Layout Structure:
┌─────────────────────────────────────────────────────────────────────┐
│ [Location Bar - Gray]  Address • Links • Language Toggle           │
├─────────────────────────────────────────────────────────────────────┤
│ [LOGO]  [Category ▼]  [────── Search Bar ──────] [🔍] [Account] [Cart] │
└─────────────────────────────────────────────────────────────────────┘
```

Key elements:
1. Top utility bar (location, links, language)
2. Main header with:
   - NPD System logo (styled like Big C logo - red background, white text)
   - Category dropdown
   - Full-width search bar with yellow search button
   - User account menu
   - Additional navigation icons

---

## Phase 3: Update Components with New Theme

### 3.1 AuthForm.tsx
- Update logo styling to use red background with white text
- Apply green gradient background to the page
- Use yellow/orange for primary CTA buttons

### 3.2 AuthenticatedWorkflowApp.tsx
- Replace current header with BigCHeader component
- Update navigation tabs to use Big C color scheme
- Add green gradient accents to the main content area

### 3.3 Card Components
- Add subtle green left border or shadow to match Big C style
- Update badge colors to use yellow/orange for promotions/status

---

## Phase 4: Category Icons Section (Optional Enhancement)

Based on Big C's category icons row, add colorful category/division icons:

```text
┌────────────────────────────────────────────────────────────────────┐
│  หมวดหมู่ (Categories)                                            │
│  [🏥] [🤝] [👨‍👩‍👧] [C] [🛒] [🎄] [🏪] [👩] [👨‍👩‍👧‍👦] [SME]               │
│  ร้านขายยา  รวมพลัง  สินค้า...  บิ๊กซี  ชวนช้อป  สินค้าตาม  Only@  ดีลเด็ด  สินค้าเด็ด  SME │
└────────────────────────────────────────────────────────────────────┘
```

Apply this pattern to division selector with colorful circular icons.

---

## Phase 5: Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Update all CSS variables to Big C color scheme |
| `tailwind.config.ts` | Add Big C specific color extensions if needed |
| `src/components/layout/BigCHeader.tsx` | NEW - Branded header component |
| `src/components/auth/AuthForm.tsx` | Update styling to match theme |
| `src/components/npd/AuthenticatedWorkflowApp.tsx` | Integrate new header, update colors |
| `src/components/npd/DivisionSelector.tsx` | Update with colorful circular icons |

---

## Phase 6: Dark Mode Adjustments

Update dark mode CSS variables to maintain readability:

```css
.dark {
  --background: 0 0% 10%;
  --primary: 0 70% 55%;
  --accent: 100 60% 50%;
  --sidebar-background: 100 60% 25%;
}
```

---

## Technical Considerations

1. **Font**: Keep IBM Plex Sans for readability, or consider adding Thai-optimized fonts
2. **Bilingual Support**: The theme already supports Thai language - ensure all new elements have Thai labels
3. **Responsive Design**: Header must collapse properly on mobile
4. **Contrast Ratios**: Ensure WCAG AA compliance with bright green/red combinations

---

## Summary of Changes

1. **Color Scheme**: Transform from navy/coral to Big C green/red/yellow
2. **Header**: Create branded header with search bar and Big C styling
3. **Buttons**: Primary buttons use red, accent buttons use green
4. **Badges**: Status badges use yellow/orange for highlights
5. **Backgrounds**: Subtle green gradients for main content areas
6. **Icons**: Colorful circular icons for divisions/categories




# Multi-Tier Package & Module Configuration (Mock-up)

## Overview

Add a new admin screen for managing service tiers and mapping system modules to each tier. This controls which functional modules are available to suppliers based on their assigned tier level.

---

## Data Model (Mock Data)

### New file: `src/data/mock/tiers.ts`

```typescript
export interface MockModule {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
}

export interface MockTier {
  id: string;
  name: string;        // e.g. "Tier A", "Tier B"
  description: string;
  color: string;       // badge color
  activeModules: string[]; // module IDs
  supplierCount: number;   // how many suppliers assigned
  createdAt: Date;
}
```

**Predefined modules:**
- New Item Creation
- Supply Chain Management
- Pricing & Promotions
- Compliance & Certification
- Analytics & Reports
- E-Commerce Integration
- Inventory Management
- DC Operations

**Default tiers:**
- Tier A (Premium) -- all modules active
- Tier B (Standard) -- subset of modules
- Tier C (Basic) -- minimal modules

---

## New Components

### 1. `src/components/admin/TierManagement.tsx` (Main Screen)

Layout:
```
┌─────────────────────────────────────────────────────┐
│ ← Back    Tier & Module Configuration    [+ New Tier]│
│ Manage service tiers and module access               │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│ │ Tier A   │  │ Tier B   │  │ Tier C   │            │
│ │ Premium  │  │ Standard │  │ Basic    │            │
│ │ 8 modules│  │ 5 modules│  │ 3 modules│            │
│ │ 12 suppl.│  │ 25 suppl.│  │ 8 suppl. │            │
│ │ [Edit]   │  │ [Edit]   │  │ [Delete] │            │
│ └──────────┘  └──────────┘  └──────────┘            │
│                                                      │
│ ┌────────────────────────────────────────────────┐   │
│ │ Module Matrix                                   │  │
│ ├────────────────────┬───────┬───────┬───────────┤  │
│ │ Module             │Tier A │Tier B │Tier C     │  │
│ ├────────────────────┼───────┼───────┼───────────┤  │
│ │ New Item Creation  │  ✓    │  ✓    │  ✓        │  │
│ │ Supply Chain Mgmt  │  ✓    │  ✓    │  -        │  │
│ │ Pricing & Promos   │  ✓    │  ✓    │  -        │  │
│ │ Compliance         │  ✓    │  -    │  -        │  │
│ │ Analytics          │  ✓    │  -    │  -        │  │
│ │ E-Commerce         │  ✓    │  ✓    │  ✓        │  │
│ │ Inventory Mgmt     │  ✓    │  ✓    │  -        │  │
│ │ DC Operations      │  ✓    │  -    │  -        │  │
│ └────────────────────┴───────┴───────┴───────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2. `src/components/admin/TierFormDialog.tsx` (Create/Edit Dialog)

- Name, Description, Color selection
- Checklist of all available modules with toggles
- Save/Cancel buttons

### 3. `src/hooks/useTiers.ts` (State Management)

- CRUD operations on mock tier data
- `createTier`, `updateTier`, `deleteTier`
- `toggleModule(tierId, moduleId)` for quick matrix toggling
- Toast notifications for all actions

---

## Integration Points

### Admin Navigation

Add a new tab "Tiers" in `AuthenticatedWorkflowApp.tsx` for the admin role, and a new View type `'tiers'`.

### Admin Dashboard Quick Action

Add a new quick action card in `AdminDashboard.tsx` linking to the tier config screen (replacing the "Coming Soon" Analytics card or adding alongside it).

### Mock Data Export

Update `src/data/mock/index.ts` to export tier and module data.

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/data/mock/tiers.ts` | **Create** | Mock tier and module definitions |
| `src/data/mock/index.ts` | Modify | Export new tier types and data |
| `src/hooks/useTiers.ts` | **Create** | Hook for tier CRUD operations |
| `src/components/admin/TierManagement.tsx` | **Create** | Main tier config screen with matrix view |
| `src/components/admin/TierFormDialog.tsx` | **Create** | Create/Edit tier dialog with module toggles |
| `src/components/admin/index.ts` | Modify | Export new components |
| `src/components/npd/AuthenticatedWorkflowApp.tsx` | Modify | Add "Tiers" tab and route for admin |
| `src/components/npd/dashboards/AdminDashboard.tsx` | Modify | Add quick action card for Tiers |

---

## Key UI Features

- **Tier cards** with color-coded badges showing module count and supplier count
- **Module matrix table** with checkbox toggles for quick assignment
- **Create/Edit dialog** with module checklist and tier metadata
- **Delete confirmation** with warning about affected suppliers
- **Toast notifications** for all CRUD actions
- Follows existing admin screen patterns (UserManagement style with back button, cards, tables)


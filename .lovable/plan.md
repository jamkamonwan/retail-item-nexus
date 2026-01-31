
# User Story 7.1: Role-Based Dashboard Implementation

## Overview
Enhance the NPD system to provide role-specific dashboard experiences. After login, each role will see a customized view showing only the information and actions relevant to their responsibilities.

## What This Means For You
- **Supplier**: See your submissions and drafts with focus on creation/editing
- **Buyer**: See items pending your review with approval actions
- **SCM/Finance/Commercial**: See items at your approval stage
- **Admin**: See system-wide overview plus configuration options

Each role will have a tailored experience showing what matters most to them.

---

## Technical Details

### 1. Add Admin Role to Type System

**File: `src/types/npd.ts`**
- Add `'admin'` to the `UserType` union type
- Add Admin entry to `USER_TYPES` constant with label "Administrator"

### 2. Create Role-Based Dashboard Views

**New File: `src/components/npd/dashboards/SupplierDashboard.tsx`**
- Show "My Drafts" section prominently
- Show "My Submissions" with status tracking
- Quick action: "Create New Submission" button
- Filter to only show user's own submissions

**New File: `src/components/npd/dashboards/ApproverDashboard.tsx`**
- Reusable component for Buyer, Commercial, Finance, SCM roles
- Props: `role`, `pendingStatus` (e.g., 'pending_buyer')
- Show "Awaiting Your Review" queue prominently
- Count badge for pending items
- Quick approve/reject actions inline

**New File: `src/components/npd/dashboards/AdminDashboard.tsx`**
- System overview with all submission counts by status
- User management section (future)
- Link to Field Approval Config
- Analytics summary

### 3. Update AuthenticatedWorkflowApp

**File: `src/components/npd/AuthenticatedWorkflowApp.tsx`**

Changes:
- Remove the Demo Role Switcher (or make it Admin-only)
- Use actual `role` from `useAuth()` instead of `demoRole`
- Render different dashboard based on user's role:

```text
Role Mapping:
  supplier  → SupplierDashboard
  buyer     → ApproverDashboard (pendingStatus: 'pending_buyer')
  commercial → ApproverDashboard (pendingStatus: 'pending_commercial')
  finance   → ApproverDashboard (pendingStatus: 'pending_finance')
  scm       → ApproverDashboard (pendingStatus: 'pending_scm' - future)
  im        → ApproverDashboard (pendingStatus: 'pending_im' - future)
  admin     → AdminDashboard
```

### 4. Enhance Header Navigation

**File: `src/components/npd/AuthenticatedWorkflowApp.tsx`**

- Show/hide navigation tabs based on role:
  - Supplier: "My Submissions" | "New Entry"
  - Approvers: "Review Queue" | "All Items"  
  - Admin: "Dashboard" | "All Items" | "Config" | "Users"
- Keep user name and role badge visible in header (already done via UserMenu)

### 5. Role-Based Data Filtering

**File: `src/hooks/useSubmissions.ts`**

Add optional filtering parameter:
- `filterByRole?: UserType` - filters submissions relevant to role
- Supplier: Filter by `created_by = current_user_id`
- Buyer: Can see all, but highlights `pending_buyer`
- Finance: Can see all, but highlights `pending_finance`

### 6. Update Database Migration (Optional Enhancement)

Add department support for future use:
- Add `department` column to `profiles` table
- Allow filtering submissions by department

---

## Dashboard Layout Summary

| Role | Primary View | Key Actions | Config Access |
|------|-------------|-------------|---------------|
| Supplier | My Submissions list | Create, Edit Draft | No |
| Buyer | Pending Buyer Queue | Approve, Reject, Revise | No |
| Commercial | Pending Commercial Queue | Approve, Reject, Revise | No |
| Finance | Pending Finance Queue | Approve, Reject, Revise | No |
| SCM | Pending SCM Queue | Approve, Reject, Revise | No |
| Admin | System Overview | All actions | Yes |

---

## Files to Create
1. `src/components/npd/dashboards/SupplierDashboard.tsx`
2. `src/components/npd/dashboards/ApproverDashboard.tsx`
3. `src/components/npd/dashboards/AdminDashboard.tsx`
4. `src/components/npd/dashboards/index.ts`

## Files to Modify
1. `src/types/npd.ts` - Add admin role
2. `src/components/npd/AuthenticatedWorkflowApp.tsx` - Route to correct dashboard
3. `src/hooks/useSubmissions.ts` - Add role-based filtering
4. Database migration - Update `app_role` enum to include 'admin'

---

## Implementation Order
1. Add admin role to types and database enum
2. Create dashboard components (Supplier, Approver, Admin)
3. Update AuthenticatedWorkflowApp to render based on role
4. Add role-based filtering to useSubmissions hook
5. Test each role's experience end-to-end



# Fresh Start Plan: Design-First with Mock Data

## Overview

This plan resets the backend database completely and refactors the frontend to use **local mock data** instead of database calls. This allows you to:
- Rapidly iterate on UI/UX designs without database constraints
- Define user flows and screen layouts first
- Build the database schema later based on finalized requirements

---

## Phase 1: Database Cleanup

### Drop All Existing Tables

The following tables will be dropped to give you a clean slate:

| Table | Purpose |
|-------|---------|
| `npd_submissions` | Product submission records |
| `npd_workflow_history` | Workflow audit trail |
| `field_approval_config` | Field-level approval settings |
| `field_approvals` | Per-field approval tracking |
| `profiles` | User profile data |
| `user_roles` | Role assignments |
| `user_departments` | Department assignments |
| `user_permissions` | Permission assignments |
| `user_suppliers` | Supplier-user links |
| `suppliers` | Supplier master data |
| `departments` | Department master data |

Also remove:
- Related database functions (`is_admin`, `handle_new_user`)
- Database triggers
- Custom enum types

---

## Phase 2: Frontend Mock Data System

### 2.1 Create Mock Data Files

Create a centralized mock data system at `src/data/mock/`:

```
src/data/mock/
  index.ts           # Export all mock data
  users.ts           # Mock user profiles
  submissions.ts     # Mock NPD submissions
  suppliers.ts       # Mock supplier data
  departments.ts     # Mock departments
```

### 2.2 Mock User Data

Pre-populated users for each role:

| Role | Name | Email |
|------|------|-------|
| supplier | John Supplier | john.supplier@example.com |
| buyer | Sarah Buyer | sarah.buyer@example.com |
| commercial | Mike Commercial | mike.commercial@example.com |
| finance | Lisa Finance | lisa.finance@example.com |
| admin | Admin User | admin@example.com |

### 2.3 Mock Submission Data

5-10 sample NPD submissions across:
- Different divisions (HL, DF, SL, etc.)
- Different workflow statuses (draft, pending_buyer, pending_commercial, etc.)
- Realistic product names and form data

---

## Phase 3: Refactor Hooks to Use Mock Data

### Replace Database Calls with Mock Data

| Hook | Current Behavior | New Behavior |
|------|------------------|--------------|
| `useAuth` | Supabase Auth | Mock user selection |
| `useSubmissions` | Fetch from DB | Return mock submissions |
| `useUsers` | Fetch profiles/roles | Return mock users |
| `useSuppliers` | Fetch suppliers | Return mock suppliers |
| `useDepartments` | Fetch departments | Return mock departments |

### Add Mock Mode Toggle (Optional)

A simple way to switch between:
- Mock data (for design)
- Real database (when ready to connect)

---

## Phase 4: Enhanced Role Simulator

The current "Demo Role" switcher will become the primary way to test different user experiences:

- Keep existing role selector in header
- Add mock user profile display
- Show role-specific data in each dashboard

---

## What Changes on Screen

### Dashboard Views
- **Supplier Dashboard**: Shows 3-5 mock submissions with various statuses
- **Buyer Dashboard**: Shows pending review queue with mock items
- **Admin Dashboard**: Shows overview stats from mock data
- **All Items View**: Lists all mock submissions with filters working

### Forms
- Auto-fill button continues to work (generates dummy data)
- Form submissions update local state (not database)
- All role-based field visibility continues to work

---

## Technical Details

### Files to Create

1. **`src/data/mock/index.ts`**
   - Central export for all mock data
   - Mock state management with React context

2. **`src/data/mock/users.ts`**
   - 5+ mock user profiles with roles
   - Type-safe user data structure

3. **`src/data/mock/submissions.ts`**
   - 10+ mock NPD submissions
   - Covers all workflow states and divisions

4. **`src/data/mock/suppliers.ts`**
   - 5+ mock supplier companies

### Files to Modify

1. **`src/hooks/useAuth.ts`**
   - Return mock user instead of Supabase auth
   - Allow role switching

2. **`src/hooks/useSubmissions.ts`**
   - Return mock submissions
   - Local state for CRUD operations

3. **`src/hooks/useUsers.ts`**
   - Return mock user list
   - Local state for user management

4. **`src/hooks/useSuppliers.ts`** & **`src/hooks/useDepartments.ts`**
   - Return static mock data

5. **`src/components/npd/AuthenticatedWorkflowApp.tsx`**
   - Remove auth dependency
   - Always show as "logged in" with mock user

### Database Migration

Single SQL migration to:
- Drop all 11 tables
- Drop all custom functions and triggers
- Drop custom enum types

---

## Benefits of This Approach

1. **Rapid UI iteration**: Change screens without waiting for database updates
2. **Realistic testing**: Mock data shows how the UI looks with real content
3. **User story driven**: Design flows first, then build the schema to match
4. **Easy reset**: Clear mock state without database migrations
5. **Flexible fields**: Add/remove form fields without schema changes

---

## Next Steps After This Plan

Once you approve, I will:
1. Create the database migration to drop all tables
2. Create the mock data files
3. Update all hooks to use mock data
4. Verify the UI displays mock content correctly

Then you can share your user stories and we'll design each screen flow together.


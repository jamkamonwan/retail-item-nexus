

# User Story 7.2: Role-Based Access Control and User Account Management

## Overview
This plan implements a comprehensive admin panel for managing users, roles, permissions, and departments. Administrators will be able to create, update, and deactivate user accounts with granular control over access permissions.

## What This Means For You
- **Admins** get a full user management dashboard to create and manage accounts
- Each user can have assigned **roles**, **departments**, and specific **permissions**
- Users can be **activated/deactivated** without deleting their data
- **Search and filter** users by name, role, department, or status
- Track when users were created and last logged in

---

## Technical Details

### 1. Database Schema Updates

**New Tables to Create:**

**a) `departments` table** - Store department definitions
```text
- id: uuid (primary key)
- code: text (HL, HOL, DF, NF, SL, FF, PH)
- name: text (Home & Lifestyle, etc.)
- created_at: timestamp
```

**b) `user_departments` table** - Junction table for user-department assignments
```text
- id: uuid (primary key)
- user_id: uuid (references profiles.user_id)
- department_code: text
- created_at: timestamp
- unique constraint on (user_id, department_code)
```

**c) `user_permissions` table** - Store granular permissions
```text
- id: uuid (primary key)
- user_id: uuid (references profiles.user_id)
- permission: text (can_approve, can_reject, can_revise, can_view_all_depts, can_export, can_access_reports)
- created_at: timestamp
```

**d) `suppliers` table** - Store supplier entities
```text
- id: uuid (primary key)
- name: text
- code: text (unique)
- is_active: boolean
- created_at: timestamp
```

**e) `user_suppliers` table** - Link users to suppliers
```text
- id: uuid (primary key)
- user_id: uuid (references profiles.user_id)
- supplier_id: uuid (references suppliers.id)
- created_at: timestamp
```

**Modify `profiles` table:**
```text
- Add: status text ('active', 'inactive', 'locked') default 'active'
- Add: last_login_at timestamp (nullable)
- Add: user_type text ('internal', 'external') default 'internal'
```

**Update `app_role` enum:** Add 'nsd' role if not present

### 2. RLS Policies

**Security considerations:**
- Only admins can view all user data
- Users can view their own profile
- Only admins can create/update/deactivate users
- Create security definer function: `is_admin(user_id)` to check admin role

### 3. New Components

**a) `src/components/admin/UserManagement.tsx`**
Main container with:
- Search bar (name, email, user ID)
- Filter dropdowns (role, department, status, supplier)
- User list table with sortable columns
- Create/Edit/Deactivate actions

**b) `src/components/admin/UserTable.tsx`**
Table component displaying:
- User ID, Name, Email
- Role(s) badges
- Department(s)
- Supplier (if applicable)
- Status indicator (Active/Inactive/Locked)
- Last login date
- Created date
- Action buttons (View, Edit, Deactivate)

**c) `src/components/admin/UserFormDialog.tsx`**
Modal dialog for Create/Edit user:
- Full name (required, 2-100 chars)
- Email (required, unique, read-only after creation)
- User type toggle: Internal / External
- Multi-select roles
- Department multi-select (required for internal)
- Supplier select (required for external)
- Permission checkboxes:
  - Can approve submissions
  - Can reject submissions
  - Can send back for corrections
  - Can view all departments
  - Can export data
  - Can access reports
- Status toggle (Active/Inactive)

**d) `src/components/admin/UserFilters.tsx`**
Filter component with:
- Search input with debounce
- Role dropdown filter
- Department dropdown filter
- Status dropdown filter
- Clear filters button

### 4. New Hooks

**a) `src/hooks/useUsers.ts`**
```text
- fetchUsers(filters) - Get paginated user list with filters
- createUser(userData) - Create new user via Supabase auth.admin API
- updateUser(userId, data) - Update user profile, roles, departments
- deactivateUser(userId) - Set status to 'inactive'
- activateUser(userId) - Set status to 'active'
- resetPassword(userId) - Trigger password reset email
- unlockAccount(userId) - Set status from 'locked' to 'active'
```

**b) `src/hooks/useDepartments.ts`**
```text
- departments - List of all departments
- loading state
```

**c) `src/hooks/useSuppliers.ts`**
```text
- suppliers - List of all suppliers
- loading state
- addSupplier(name, code) - Create new supplier
```

### 5. Backend Edge Function

**`supabase/functions/admin-user-management/index.ts`**
Required for admin-only operations:
- Create user (uses service role to call auth.admin.createUser)
- Send welcome email with temporary password
- Generate secure temporary password
- Force password change on first login

This is needed because client-side cannot create users for others.

### 6. Update AdminDashboard

**File: `src/components/npd/dashboards/AdminDashboard.tsx`**

Add clickable "User Management" card that navigates to user management view:
- Link to new UserManagement component
- Show count of active/inactive users

### 7. Update AuthenticatedWorkflowApp

**File: `src/components/npd/AuthenticatedWorkflowApp.tsx`**

- Add 'users' to View type
- Add Users tab for admin role
- Route to UserManagement component when 'users' view is active

### 8. Type Updates

**File: `src/types/npd.ts`**

Add new types:
```text
- Department type and DEPARTMENTS constant
- UserStatus type: 'active' | 'inactive' | 'locked'
- UserPermission type
- User interface with full profile data
```

---

## Implementation Order

1. **Database migrations** - Create new tables and update existing ones
2. **RLS policies** - Secure admin-only access
3. **Edge function** - Create admin user management endpoint
4. **Type definitions** - Add new types to npd.ts
5. **Hooks** - useUsers, useDepartments, useSuppliers
6. **Components** - UserTable, UserFormDialog, UserFilters, UserManagement
7. **Update AdminDashboard** - Link to user management
8. **Update navigation** - Add Users tab for admin

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/UserManagement.tsx` | Main user management container |
| `src/components/admin/UserTable.tsx` | Users list table |
| `src/components/admin/UserFormDialog.tsx` | Create/Edit user modal |
| `src/components/admin/UserFilters.tsx` | Search and filter controls |
| `src/components/admin/index.ts` | Export all admin components |
| `src/hooks/useUsers.ts` | User CRUD operations |
| `src/hooks/useDepartments.ts` | Department data hook |
| `src/hooks/useSuppliers.ts` | Supplier data hook |
| `supabase/functions/admin-user-management/index.ts` | Admin user API |

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/npd.ts` | Add Department, UserStatus, UserPermission types |
| `src/components/npd/dashboards/AdminDashboard.tsx` | Link to User Management |
| `src/components/npd/AuthenticatedWorkflowApp.tsx` | Add 'users' view and navigation |

## Database Migrations

1. Create `departments` table with seed data
2. Create `user_departments` junction table
3. Create `user_permissions` table
4. Create `suppliers` and `user_suppliers` tables
5. Alter `profiles` table to add status, last_login_at, user_type
6. Update RLS policies for admin access
7. Create `is_admin()` security definer function

---

## Security Considerations

- Admin status checked via server-side `is_admin()` function (not client-side)
- Edge function uses service role key for privileged operations
- RLS policies restrict non-admin users from viewing other user data
- Sensitive operations require confirmation dialogs
- All admin actions should be logged (future: audit trail table)

---

## Validation Rules Summary

| Field | Validation |
|-------|------------|
| Email | Valid format, unique in system |
| Full Name | 2-100 characters, required |
| Role | At least one role required |
| Department | Required for internal users |
| Supplier | Required for external/supplier users |
| Password | Minimum 6 characters (auto-generated for admin-created users) |


// Admin & User Management Types

export type UserStatus = 'active' | 'inactive' | 'locked';

export type UserTypeValue = 'internal' | 'external';

export type PermissionType = 
  | 'can_approve'
  | 'can_reject'
  | 'can_revise'
  | 'can_view_all_depts'
  | 'can_export'
  | 'can_access_reports';

export const PERMISSIONS: Record<PermissionType, { label: string; description: string }> = {
  can_approve: { label: 'Can Approve', description: 'Approve submissions' },
  can_reject: { label: 'Can Reject', description: 'Reject submissions' },
  can_revise: { label: 'Can Revise', description: 'Send submissions back for corrections' },
  can_view_all_depts: { label: 'View All Departments', description: 'Access all department data' },
  can_export: { label: 'Can Export', description: 'Export data to files' },
  can_access_reports: { label: 'Access Reports', description: 'View system reports' },
};

export interface Department {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
  user_type: UserTypeValue;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  roles: string[];
  departments: string[];
  permissions: PermissionType[];
  supplier?: Supplier | null;
}

export interface UserFilters {
  search: string;
  role: string | null;
  department: string | null;
  status: UserStatus | null;
  supplierId: string | null;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  userType: UserTypeValue;
  roles: string[];
  departments?: string[];
  supplierId?: string;
  permissions?: PermissionType[];
}

export interface UpdateUserData {
  userId: string;
  fullName?: string;
  userType?: UserTypeValue;
  status?: UserStatus;
  roles?: string[];
  departments?: string[];
  supplierId?: string;
  permissions?: PermissionType[];
}

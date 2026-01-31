// Admin & User Management Types
// Updated for mock-data-driven design-first development

import { UserType } from './npd';

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
  description?: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserType;
  userType: UserTypeValue;
  status: UserStatus;
  department?: string;
  supplierId?: string;
  supplierName?: string;
  permissions: string[];
  avatarUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface UserFilters {
  search: string;
  role: UserType | null;
  department: string | null;
  status: UserStatus | null;
  supplierId: string | null;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  role: UserType;
  userType: UserTypeValue;
  department?: string;
  supplierId?: string;
  permissions?: PermissionType[];
}

export interface UpdateUserData {
  userId: string;
  fullName?: string;
  role?: UserType;
  userType?: UserTypeValue;
  status?: UserStatus;
  department?: string;
  supplierId?: string;
  permissions?: PermissionType[];
}

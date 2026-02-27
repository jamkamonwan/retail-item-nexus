// Mock user data for design-first development
export type MockRole = 'supplier' | 'supplier_admin' | 'buyer' | 'commercial' | 'finance' | 'scm' | 'im' | 'dc_income' | 'admin' | 'nsd';
export type MockUserType = 'internal' | 'external';
export type MockUserStatus = 'active' | 'inactive' | 'locked';

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: MockRole;
  userType: MockUserType;
  status: MockUserStatus;
  avatarUrl?: string;
  department?: string;
  supplierId?: string;
  supplierName?: string;
  supplierGroupId?: string;
  permissions: string[];
  createdAt: Date;
  lastLoginAt?: Date;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-supplier-001',
    email: 'john.supplier@acme.com',
    fullName: 'John Supplier',
    role: 'supplier',
    userType: 'external',
    status: 'active',
    supplierId: 'supplier-001',
    supplierName: 'ACME Corporation',
    supplierGroupId: 'group-001',
    permissions: [],
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2025-01-30'),
  },
  {
    id: 'user-supplier-002',
    email: 'jane.vendor@globalfoods.com',
    fullName: 'Jane Vendor',
    role: 'supplier',
    userType: 'external',
    status: 'active',
    supplierId: 'supplier-002',
    supplierName: 'Global Foods Ltd',
    supplierGroupId: 'group-002',
    permissions: [],
    createdAt: new Date('2024-02-20'),
    lastLoginAt: new Date('2025-01-28'),
  },
  {
    id: 'user-buyer-001',
    email: 'sarah.buyer@company.com',
    fullName: 'Sarah Buyer',
    role: 'buyer',
    userType: 'internal',
    status: 'active',
    department: 'Procurement',
    permissions: ['can_approve', 'can_reject', 'can_revise'],
    createdAt: new Date('2024-01-10'),
    lastLoginAt: new Date('2025-01-31'),
  },
  {
    id: 'user-buyer-002',
    email: 'tom.purchaser@company.com',
    fullName: 'Tom Purchaser',
    role: 'buyer',
    userType: 'internal',
    status: 'active',
    department: 'Procurement',
    permissions: ['can_approve', 'can_reject'],
    createdAt: new Date('2024-03-05'),
    lastLoginAt: new Date('2025-01-29'),
  },
  {
    id: 'user-commercial-001',
    email: 'mike.commercial@company.com',
    fullName: 'Mike Commercial',
    role: 'commercial',
    userType: 'internal',
    status: 'active',
    department: 'Commercial',
    permissions: ['can_approve', 'can_reject', 'can_view_all_depts'],
    createdAt: new Date('2024-01-05'),
    lastLoginAt: new Date('2025-01-30'),
  },
  {
    id: 'user-finance-001',
    email: 'lisa.finance@company.com',
    fullName: 'Lisa Finance',
    role: 'finance',
    userType: 'internal',
    status: 'active',
    department: 'Finance',
    permissions: ['can_approve', 'can_reject', 'can_access_reports'],
    createdAt: new Date('2024-01-08'),
    lastLoginAt: new Date('2025-01-31'),
  },
  {
    id: 'user-scm-001',
    email: 'david.scm@company.com',
    fullName: 'David SCM',
    role: 'scm',
    userType: 'internal',
    status: 'active',
    department: 'Supply Chain',
    permissions: ['can_approve', 'can_reject'],
    createdAt: new Date('2024-02-01'),
    lastLoginAt: new Date('2025-01-28'),
  },
  {
    id: 'user-im-001',
    email: 'emma.inventory@company.com',
    fullName: 'Emma Inventory',
    role: 'im',
    userType: 'internal',
    status: 'active',
    department: 'Inventory Management',
    permissions: ['can_approve'],
    createdAt: new Date('2024-02-15'),
    lastLoginAt: new Date('2025-01-27'),
  },
  {
    id: 'user-dc-001',
    email: 'robert.dc@company.com',
    fullName: 'Robert DC Income',
    role: 'dc_income',
    userType: 'internal',
    status: 'active',
    department: 'DC Operations',
    permissions: ['can_approve', 'can_export'],
    createdAt: new Date('2024-03-01'),
    lastLoginAt: new Date('2025-01-26'),
  },
  {
    id: 'user-nsd-001',
    email: 'nancy.nsd@company.com',
    fullName: 'Nancy NSD',
    role: 'nsd',
    userType: 'internal',
    status: 'active',
    department: 'NSD',
    permissions: ['can_approve', 'can_reject'],
    createdAt: new Date('2024-03-10'),
    lastLoginAt: new Date('2025-01-25'),
  },
  {
    id: 'user-admin-001',
    email: 'admin@company.com',
    fullName: 'Admin User',
    role: 'admin',
    userType: 'internal',
    status: 'active',
    department: 'IT',
    permissions: ['can_approve', 'can_reject', 'can_revise', 'can_view_all_depts', 'can_export', 'can_access_reports'],
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2025-01-31'),
  },
  {
    id: 'user-inactive-001',
    email: 'old.user@company.com',
    fullName: 'Old User',
    role: 'buyer',
    userType: 'internal',
    status: 'inactive',
    department: 'Procurement',
    permissions: [],
    createdAt: new Date('2023-06-01'),
    lastLoginAt: new Date('2024-06-15'),
  },
];

export const getUserByRole = (role: MockRole): MockUser | undefined => {
  return mockUsers.find(u => u.role === role && u.status === 'active');
};

export const getUsersByRole = (role: MockRole): MockUser[] => {
  return mockUsers.filter(u => u.role === role);
};

export const getActiveUsers = (): MockUser[] => {
  return mockUsers.filter(u => u.status === 'active');
};

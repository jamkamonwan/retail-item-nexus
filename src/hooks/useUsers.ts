import { useState, useCallback } from 'react';
import { mockUsers, MockUser, MockRole } from '@/data/mock';
import { toast } from 'sonner';

// Re-export for compatibility
export type { MockUser as UserProfile };
export type { MockRole };

export interface UserFilters {
  search: string;
  role: MockRole | null;
  department: string | null;
  status: 'active' | 'inactive' | 'locked' | null;
  supplierId: string | null;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  role: MockRole;
  userType: 'internal' | 'external';
  department?: string;
  supplierId?: string;
}

export interface UpdateUserData {
  userId: string;
  fullName?: string;
  role?: MockRole;
  status?: 'active' | 'inactive' | 'locked';
  department?: string;
  supplierId?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<MockUser[]>([...mockUsers]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: null,
    department: null,
    status: null,
    supplierId: null,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filtered = [...mockUsers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.fullName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.id.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role) {
      filtered = filtered.filter(u => u.role === filters.role);
    }

    if (filters.department) {
      filtered = filtered.filter(u => u.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter(u => u.status === filters.status);
    }

    if (filters.supplierId) {
      filtered = filtered.filter(u => u.supplierId === filters.supplierId);
    }

    setUsers(filtered);
    setLoading(false);
  }, [filters]);

  const createUser = async (data: CreateUserData) => {
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      userType: data.userType,
      status: 'active',
      department: data.department,
      supplierId: data.supplierId,
      permissions: [],
      createdAt: new Date(),
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success('User created successfully');
    toast.info('Temporary password: TempPass123!', { duration: 10000 });
    return newUser;
  };

  const updateUser = async (data: UpdateUserData) => {
    setUsers(prev => prev.map(u => 
      u.id === data.userId 
        ? { 
            ...u, 
            ...(data.fullName && { fullName: data.fullName }),
            ...(data.role && { role: data.role }),
            ...(data.status && { status: data.status }),
            ...(data.department && { department: data.department }),
          }
        : u
    ));
    toast.success('User updated successfully');
    return { success: true };
  };

  const deactivateUser = async (userId: string) => {
    return updateUser({ userId, status: 'inactive' });
  };

  const activateUser = async (userId: string) => {
    return updateUser({ userId, status: 'active' });
  };

  const resetPassword = async (userId: string) => {
    toast.success('Password reset successfully');
    toast.info('New temporary password: TempPass123!', { duration: 10000 });
    return { success: true };
  };

  return {
    users,
    loading,
    filters,
    setFilters,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    resetPassword,
    refetch: fetchUsers,
  };
}

import { useState, useCallback, useMemo } from 'react';
import { MockUser, mockUsers } from '@/data/mock/users';
import { mockTiers, MockTier, SYSTEM_MODULES } from '@/data/mock/tiers';
import { mockSupplierGroups } from '@/data/mock/supplierGroups';
import { toast } from 'sonner';

interface CreateStaffData {
  fullName: string;
  email: string;
  assignedModules: string[];
}

export function useSupplierStaff(adminUser: { id?: string; supplierGroupId?: string } | null) {
  const [users, setUsers] = useState<MockUser[]>([...mockUsers]);

  const group = useMemo(() => {
    if (!adminUser?.supplierGroupId) return null;
    return mockSupplierGroups.find(g => g.id === adminUser.supplierGroupId) ?? null;
  }, [adminUser?.supplierGroupId]);

  const tier: MockTier | null = useMemo(() => {
    if (!group) return null;
    return mockTiers.find(t => t.assignedGroups.includes(group.id)) ?? null;
  }, [group]);

  const staffUsers = useMemo(() => {
    if (!adminUser?.supplierGroupId) return [];
    return users.filter(
      u => u.supplierGroupId === adminUser.supplierGroupId && u.role === 'supplier'
    );
  }, [users, adminUser?.supplierGroupId]);

  const activeCount = useMemo(() => staffUsers.filter(u => u.status === 'active').length, [staffUsers]);
  const maxUsers = tier?.maxUsers ?? 0;
  const canCreateUser = activeCount < maxUsers;

  const availableModules = useMemo(() => {
    if (!tier) return [];
    return SYSTEM_MODULES.filter(m => tier.activeModules.includes(m.id));
  }, [tier]);

  const createStaffUser = useCallback((data: CreateStaffData) => {
    if (!canCreateUser) {
      toast.error('User limit reached. Deactivate a user before creating a new one.');
      return;
    }
    const newUser: MockUser = {
      id: `user-supplier-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: 'supplier',
      userType: 'external',
      status: 'active',
      supplierGroupId: adminUser?.supplierGroupId,
      permissions: [],
      assignedModules: data.assignedModules,
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
    toast.success(`${data.fullName} created successfully`);
  }, [canCreateUser, adminUser?.supplierGroupId]);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const newStatus = u.status === 'active' ? 'inactive' : 'active';
      // Check headcount when activating
      if (newStatus === 'active') {
        const currentActive = prev.filter(
          p => p.supplierGroupId === adminUser?.supplierGroupId && p.role === 'supplier' && p.status === 'active'
        ).length;
        if (currentActive >= maxUsers) {
          toast.error('Cannot activate — user limit reached');
          return u;
        }
      }
      toast.success(`${u.fullName} set to ${newStatus}`);
      return { ...u, status: newStatus as MockUser['status'] };
    }));
  }, [adminUser?.supplierGroupId, maxUsers]);

  const updateModules = useCallback((userId: string, modules: string[]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, assignedModules: modules } : u));
    toast.success('Modules updated');
  }, []);

  return {
    group,
    tier,
    staffUsers,
    activeCount,
    maxUsers,
    canCreateUser,
    availableModules,
    createStaffUser,
    toggleUserStatus,
    updateModules,
  };
}

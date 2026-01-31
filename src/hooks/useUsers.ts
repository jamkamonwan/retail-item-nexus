import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserFilters, CreateUserData, UpdateUserData, PermissionType } from '@/types/admin';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: null,
    department: null,
    status: null,
    supplierId: null,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch all user departments
      const { data: userDepts, error: deptsError } = await supabase
        .from('user_departments')
        .select('user_id, department_code');

      if (deptsError) throw deptsError;

      // Fetch all user permissions
      const { data: userPerms, error: permsError } = await supabase
        .from('user_permissions')
        .select('user_id, permission');

      if (permsError) throw permsError;

      // Fetch all user suppliers with supplier details
      const { data: userSuppliers, error: suppError } = await supabase
        .from('user_suppliers')
        .select('user_id, supplier_id, suppliers(*)');

      if (suppError) throw suppError;

      // Map roles, departments, permissions to users
      const rolesMap = new Map<string, string[]>();
      roles?.forEach((r) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      const deptsMap = new Map<string, string[]>();
      userDepts?.forEach((d) => {
        const existing = deptsMap.get(d.user_id) || [];
        existing.push(d.department_code);
        deptsMap.set(d.user_id, existing);
      });

      const permsMap = new Map<string, PermissionType[]>();
      userPerms?.forEach((p) => {
        const existing = permsMap.get(p.user_id) || [];
        existing.push(p.permission as PermissionType);
        permsMap.set(p.user_id, existing);
      });

      const supplierMap = new Map<string, { id: string; name: string; code: string; is_active: boolean; created_at: string } | null>();
      userSuppliers?.forEach((us) => {
        // The joined data is in suppliers property
        const supplier = us.suppliers as { id: string; name: string; code: string; is_active: boolean; created_at: string } | null;
        supplierMap.set(us.user_id, supplier);
      });

      // Build complete user profiles
      const completeUsers: UserProfile[] = (profiles || []).map((p) => ({
        id: p.id,
        user_id: p.user_id,
        email: p.email,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        status: p.status as UserProfile['status'],
        user_type: p.user_type as UserProfile['user_type'],
        last_login_at: p.last_login_at,
        created_at: p.created_at,
        updated_at: p.updated_at,
        roles: rolesMap.get(p.user_id) || [],
        departments: deptsMap.get(p.user_id) || [],
        permissions: permsMap.get(p.user_id) || [],
        supplier: supplierMap.get(p.user_id) || null,
      }));

      // Apply filters
      let filtered = completeUsers;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.full_name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower) ||
            u.user_id.toLowerCase().includes(searchLower)
        );
      }

      if (filters.role) {
        filtered = filtered.filter((u) => u.roles.includes(filters.role!));
      }

      if (filters.department) {
        filtered = filtered.filter((u) => u.departments.includes(filters.department!));
      }

      if (filters.status) {
        filtered = filtered.filter((u) => u.status === filters.status);
      }

      if (filters.supplierId) {
        filtered = filtered.filter((u) => u.supplier?.id === filters.supplierId);
      }

      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: CreateUserData) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('admin-user-management', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        method: 'POST',
      });

      // Check for invocation errors
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create user');
      }

      // The function appends ?action=create-user via URL, we need to construct URL properly
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management`);
      url.searchParams.set('action', 'create-user');

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      toast.success('User created successfully');
      if (result.tempPassword) {
        toast.info(`Temporary password: ${result.tempPassword}`, { duration: 10000 });
      }
      await fetchUsers();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
      return null;
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management`);
      url.searchParams.set('action', 'update-user');

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      toast.success('User updated successfully');
      await fetchUsers();
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
      return null;
    }
  };

  const deactivateUser = async (userId: string) => {
    return updateUser({ userId, status: 'inactive' });
  };

  const activateUser = async (userId: string) => {
    return updateUser({ userId, status: 'active' });
  };

  const resetPassword = async (userId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management`);
      url.searchParams.set('action', 'reset-password');

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      toast.success('Password reset successfully');
      if (result.tempPassword) {
        toast.info(`New temporary password: ${result.tempPassword}`, { duration: 10000 });
      }
      return result;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
      return null;
    }
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

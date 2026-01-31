import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserType, Division } from '@/types/npd';

export interface FieldApprovalConfig {
  id: string;
  fieldId: string;
  requiredRole: UserType;
  division: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useFieldApprovalConfig() {
  const [configs, setConfigs] = useState<FieldApprovalConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('field_approval_config')
        .select('*')
        .order('field_id');

      if (error) throw error;

      const mappedConfigs: FieldApprovalConfig[] = (data || []).map((row) => ({
        id: row.id,
        fieldId: row.field_id,
        requiredRole: row.required_role as UserType,
        division: row.division,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      setConfigs(mappedConfigs);
    } catch (error) {
      console.error('Error fetching field approval configs:', error);
      toast.error('Failed to load field approval configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const addConfig = async (
    fieldId: string,
    requiredRole: UserType,
    division: string | null = null
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('field_approval_config').insert({
        field_id: fieldId,
        required_role: requiredRole,
        division: division,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('This configuration already exists');
        } else {
          throw error;
        }
        return false;
      }

      toast.success('Field approval rule added');
      await fetchConfigs();
      return true;
    } catch (error) {
      console.error('Error adding field approval config:', error);
      toast.error('Failed to add field approval rule');
      return false;
    }
  };

  const removeConfig = async (configId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('field_approval_config')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      toast.success('Field approval rule removed');
      await fetchConfigs();
      return true;
    } catch (error) {
      console.error('Error removing field approval config:', error);
      toast.error('Failed to remove field approval rule');
      return false;
    }
  };

  const getConfigsForField = (fieldId: string, division?: Division): FieldApprovalConfig[] => {
    return configs.filter(
      (c) =>
        c.fieldId === fieldId &&
        (c.division === null || c.division === division)
    );
  };

  const getConfigsForRole = (role: UserType): FieldApprovalConfig[] => {
    return configs.filter((c) => c.requiredRole === role);
  };

  return {
    configs,
    loading,
    addConfig,
    removeConfig,
    getConfigsForField,
    getConfigsForRole,
    refetch: fetchConfigs,
  };
}

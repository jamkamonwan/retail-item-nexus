import { useState, useCallback } from 'react';
import { MockRole } from '@/data/mock';
import { toast } from 'sonner';

// Re-export UserType for compatibility
export type UserType = MockRole;
export type Division = 'HL' | 'DF' | 'SL' | 'FF' | 'GS' | 'HB';

export interface FieldApprovalConfig {
  id: string;
  fieldId: string;
  requiredRole: UserType;
  division: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Mock field approval configs
const mockConfigs: FieldApprovalConfig[] = [
  {
    id: 'config-001',
    fieldId: 'retail_price',
    requiredRole: 'finance',
    division: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'config-002',
    fieldId: 'cost_price',
    requiredRole: 'finance',
    division: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'config-003',
    fieldId: 'margin',
    requiredRole: 'commercial',
    division: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

export function useFieldApprovalConfig() {
  const [configs, setConfigs] = useState<FieldApprovalConfig[]>(mockConfigs);
  const [loading] = useState(false);

  const fetchConfigs = useCallback(async () => {
    // Mock data is always ready
  }, []);

  const addConfig = async (
    fieldId: string,
    requiredRole: UserType,
    division: string | null = null
  ): Promise<boolean> => {
    // Check for duplicate
    const exists = configs.some(
      c => c.fieldId === fieldId && c.requiredRole === requiredRole && c.division === division
    );
    
    if (exists) {
      toast.error('This configuration already exists');
      return false;
    }

    const newConfig: FieldApprovalConfig = {
      id: `config-${Date.now()}`,
      fieldId,
      requiredRole,
      division,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConfigs(prev => [...prev, newConfig]);
    toast.success('Field approval rule added');
    return true;
  };

  const removeConfig = async (configId: string): Promise<boolean> => {
    setConfigs(prev => prev.filter(c => c.id !== configId));
    toast.success('Field approval rule removed');
    return true;
  };

  const getConfigsForField = (fieldId: string, division?: Division): FieldApprovalConfig[] => {
    return configs.filter(
      c =>
        c.fieldId === fieldId &&
        (c.division === null || c.division === division)
    );
  };

  const getConfigsForRole = (role: UserType): FieldApprovalConfig[] => {
    return configs.filter(c => c.requiredRole === role);
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

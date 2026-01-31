import { useState } from 'react';
import { mockSuppliers, MockSupplier } from '@/data/mock';

export type { MockSupplier as Supplier };

export function useSuppliers() {
  const [suppliers] = useState<MockSupplier[]>(mockSuppliers.filter(s => s.isActive));
  const [loading] = useState(false);

  const fetchSuppliers = async () => {
    // Mock data is always ready
  };

  const addSupplier = async (name: string, code: string): Promise<MockSupplier | null> => {
    const newSupplier: MockSupplier = {
      id: `supplier-${Date.now()}`,
      name,
      code,
      isActive: true,
      createdAt: new Date(),
    };
    // In mock mode, just return the new supplier
    console.log('[Mock] New supplier:', newSupplier);
    return newSupplier;
  };

  return { 
    suppliers, 
    loading, 
    addSupplier, 
    refetch: fetchSuppliers 
  };
}

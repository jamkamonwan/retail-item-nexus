import { useState, useCallback } from 'react';
import { MockTier, mockTiers } from '@/data/mock/tiers';
import { toast } from 'sonner';

export function useTiers() {
  const [tiers, setTiers] = useState<MockTier[]>([...mockTiers]);

  const createTier = useCallback((tier: Omit<MockTier, 'id' | 'createdAt' | 'assignedSuppliers'> & { maxUsers?: number }) => {
    const newTier: MockTier = {
      ...tier,
      id: `tier_${Date.now()}`,
      assignedSuppliers: [],
      createdAt: new Date(),
    };
    setTiers(prev => [...prev, newTier]);
    toast.success(`Tier "${tier.name}" created`);
  }, []);

  const updateTier = useCallback((id: string, updates: Partial<Omit<MockTier, 'id' | 'createdAt'>>) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Tier updated');
  }, []);

  const deleteTier = useCallback((id: string) => {
    const tier = tiers.find(t => t.id === id);
    if (tier && tier.assignedSuppliers.length > 0) {
      toast.error(`Cannot delete "${tier.name}" — ${tier.assignedSuppliers.length} suppliers are assigned`);
      return;
    }
    setTiers(prev => prev.filter(t => t.id !== id));
    toast.success('Tier deleted');
  }, [tiers]);

  const toggleModule = useCallback((tierId: string, moduleId: string) => {
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      const has = t.activeModules.includes(moduleId);
      return {
        ...t,
        activeModules: has
          ? t.activeModules.filter(m => m !== moduleId)
          : [...t.activeModules, moduleId],
      };
    }));
  }, []);

  const assignSupplier = useCallback((tierId: string, supplierId: string) => {
    setTiers(prev => prev.map(t => {
      // Remove supplier from any other tier first
      const without = t.assignedSuppliers.filter(s => s !== supplierId);
      if (t.id === tierId) {
        return { ...t, assignedSuppliers: [...without, supplierId] };
      }
      return without.length !== t.assignedSuppliers.length ? { ...t, assignedSuppliers: without } : t;
    }));
    toast.success('Supplier assigned');
  }, []);

  const removeSupplier = useCallback((tierId: string, supplierId: string) => {
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      return { ...t, assignedSuppliers: t.assignedSuppliers.filter(s => s !== supplierId) };
    }));
    toast.success('Supplier removed');
  }, []);

  return { tiers, createTier, updateTier, deleteTier, toggleModule, assignSupplier, removeSupplier };
}

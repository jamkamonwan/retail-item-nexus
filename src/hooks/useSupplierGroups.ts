import { useState, useCallback } from 'react';
import { mockSupplierGroups, MockSupplierGroup } from '@/data/mock/supplierGroups';
import { toast } from 'sonner';

export function useSupplierGroups() {
  const [groups, setGroups] = useState<MockSupplierGroup[]>([...mockSupplierGroups]);

  const getSupplierGroup = useCallback(
    (supplierId: string): MockSupplierGroup | undefined =>
      groups.find((g) => g.supplierIds.includes(supplierId)),
    [groups]
  );

  const createGroup = useCallback((name: string, description?: string) => {
    const newGroup: MockSupplierGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      supplierIds: [],
      createdAt: new Date(),
    };
    setGroups((prev) => [...prev, newGroup]);
    toast.success(`Group "${name}" created`);
    return newGroup;
  }, []);

  const updateGroup = useCallback(
    (id: string, data: { name?: string; description?: string }) => {
      setGroups((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...data } : g))
      );
      toast.success('Group updated');
    },
    []
  );

  const deleteGroup = useCallback(
    (id: string) => {
      const group = groups.find((g) => g.id === id);
      if (group && group.supplierIds.length > 0) {
        toast.error('Cannot delete a group that has suppliers assigned');
        return false;
      }
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Group deleted');
      return true;
    },
    [groups]
  );

  const assignSupplier = useCallback(
    (groupId: string, supplierId: string) => {
      const existing = groups.find(
        (g) => g.id !== groupId && g.supplierIds.includes(supplierId)
      );
      if (existing) {
        toast.error(`Supplier already assigned to "${existing.name}"`);
        return false;
      }
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, supplierIds: [...g.supplierIds, supplierId] }
            : g
        )
      );
      toast.success('Supplier assigned');
      return true;
    },
    [groups]
  );

  const removeSupplier = useCallback((groupId: string, supplierId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              supplierIds: g.supplierIds.filter((id) => id !== supplierId),
              mainSupplierId: g.mainSupplierId === supplierId ? undefined : g.mainSupplierId,
            }
          : g
      )
    );
    toast.info('Supplier removed from group');
  }, []);

  const setMainSupplier = useCallback((groupId: string, supplierId: string | undefined) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, mainSupplierId: supplierId } : g
      )
    );
    if (supplierId) toast.success('Main supplier set');
    else toast.info('Main supplier cleared');
  }, []);

  return { groups, createGroup, updateGroup, deleteGroup, assignSupplier, removeSupplier, getSupplierGroup, setMainSupplier };
}

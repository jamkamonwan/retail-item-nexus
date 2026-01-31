import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/types/admin';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const addSupplier = async (name: string, code: string) => {
    const { data, error } = await supabase
      .from('suppliers')
      .insert({ name, code })
      .select()
      .single();

    if (error) {
      console.error('Error adding supplier:', error);
      return null;
    }

    setSuppliers((prev) => [...prev, data]);
    return data;
  };

  return { suppliers, loading, addSupplier, refetch: fetchSuppliers };
}

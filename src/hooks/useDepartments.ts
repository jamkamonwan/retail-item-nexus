import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/admin';

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching departments:', error);
      } else {
        setDepartments(data || []);
      }
      setLoading(false);
    }

    fetchDepartments();
  }, []);

  return { departments, loading };
}

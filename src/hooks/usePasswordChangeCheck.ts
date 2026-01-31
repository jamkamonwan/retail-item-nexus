import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UsePasswordChangeCheckResult {
  mustChangePassword: boolean;
  loading: boolean;
  clearPasswordChangeFlag: () => void;
}

export function usePasswordChangeCheck(user: User | null): UsePasswordChangeCheckResult {
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPasswordChangeRequired = async () => {
      if (!user) {
        setMustChangePassword(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('must_change_password')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking password change status:', error);
          setMustChangePassword(false);
        } else {
          setMustChangePassword(data?.must_change_password ?? false);
        }
      } catch (error) {
        console.error('Error in password change check:', error);
        setMustChangePassword(false);
      } finally {
        setLoading(false);
      }
    };

    checkPasswordChangeRequired();
  }, [user]);

  const clearPasswordChangeFlag = () => {
    setMustChangePassword(false);
  };

  return {
    mustChangePassword,
    loading,
    clearPasswordChangeFlag,
  };
}

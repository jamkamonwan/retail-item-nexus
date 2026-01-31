import { useState } from 'react';

interface UsePasswordChangeCheckResult {
  mustChangePassword: boolean;
  loading: boolean;
  clearPasswordChangeFlag: () => void;
}

// In mock mode, password change is not required
export function usePasswordChangeCheck(_user: unknown): UsePasswordChangeCheckResult {
  const [mustChangePassword] = useState(false);
  const [loading] = useState(false);

  const clearPasswordChangeFlag = () => {
    // No-op in mock mode
  };

  return {
    mustChangePassword,
    loading,
    clearPasswordChangeFlag,
  };
}

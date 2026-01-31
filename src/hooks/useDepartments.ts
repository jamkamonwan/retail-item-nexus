import { useState } from 'react';
import { mockDepartments, MockDepartment } from '@/data/mock';

export type { MockDepartment as Department };

export function useDepartments() {
  const [departments] = useState<MockDepartment[]>(mockDepartments);
  const [loading] = useState(false);

  return { departments, loading };
}

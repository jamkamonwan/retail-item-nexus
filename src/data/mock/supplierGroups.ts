export interface MockSupplierGroup {
  id: string;
  name: string;
  description?: string;
  supplierIds: string[];
  createdAt: Date;
}

export const mockSupplierGroups: MockSupplierGroup[] = [
  {
    id: 'group-001',
    name: 'Group Unilever',
    description: 'All Unilever supplier codes across divisions',
    supplierIds: ['supplier-009', 'supplier-010', 'supplier-011'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'group-002',
    name: 'Group DKSH',
    description: 'DKSH Thailand distribution codes',
    supplierIds: ['supplier-007'],
    createdAt: new Date('2024-02-15'),
  },
];

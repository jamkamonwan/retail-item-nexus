export interface MockSupplierGroup {
  id: string;
  name: string;
  description?: string;
  supplierIds: string[];
  mainSupplierId?: string;
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
  {
    id: 'group-003',
    name: 'Group Nestle',
    description: 'Nestle Thailand supplier codes',
    supplierIds: ['supplier-001', 'supplier-002'],
    createdAt: new Date('2024-03-20'),
  },
  {
    id: 'group-004',
    name: 'Group CP',
    description: 'CP Group supplier codes',
    supplierIds: ['supplier-003', 'supplier-004', 'supplier-005'],
    createdAt: new Date('2024-04-10'),
  },
];

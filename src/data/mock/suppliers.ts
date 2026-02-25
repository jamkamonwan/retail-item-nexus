// Mock supplier data for design-first development

export interface MockSupplier {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  createdAt: Date;
}

export const mockSuppliers: MockSupplier[] = [
  {
    id: 'supplier-001',
    name: 'ACME Corporation',
    code: 'ACME',
    isActive: true,
    contactEmail: 'contact@acme.com',
    contactPhone: '+66-2-123-4567',
    address: 'Bangkok, Thailand',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'supplier-002',
    name: 'Global Foods Ltd',
    code: 'GFOOD',
    isActive: true,
    contactEmail: 'info@globalfoods.com',
    contactPhone: '+66-2-234-5678',
    address: 'Samut Prakan, Thailand',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 'supplier-003',
    name: 'Fresh Produce Co',
    code: 'FRESH',
    isActive: true,
    contactEmail: 'sales@freshproduce.co.th',
    contactPhone: '+66-2-345-6789',
    address: 'Nonthaburi, Thailand',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: 'supplier-004',
    name: 'Premium Imports',
    code: 'PREM',
    isActive: true,
    contactEmail: 'imports@premium.com',
    contactPhone: '+66-2-456-7890',
    address: 'Pathum Thani, Thailand',
    createdAt: new Date('2023-04-05'),
  },
  {
    id: 'supplier-005',
    name: 'Thai Organic Farm',
    code: 'TORG',
    isActive: true,
    contactEmail: 'organic@thaifarm.com',
    contactPhone: '+66-2-567-8901',
    address: 'Chiang Mai, Thailand',
    createdAt: new Date('2023-05-15'),
  },
  {
    id: 'supplier-006',
    name: 'Old Supplier Inc',
    code: 'OLDSUP',
    isActive: false,
    contactEmail: 'contact@oldsupplier.com',
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'supplier-007',
    name: 'DKSH Thailand',
    code: 'DKSH',
    isActive: true,
    contactEmail: 'contact@dksh.co.th',
    contactPhone: '+66-2-678-9012',
    address: 'Bangkok, Thailand',
    createdAt: new Date('2023-06-01'),
  },
  {
    id: 'supplier-008',
    name: 'Thainamthip Co.',
    code: 'TNAM',
    isActive: true,
    contactEmail: 'info@thainamthip.com',
    contactPhone: '+66-2-789-0123',
    address: 'Pathum Thani, Thailand',
    createdAt: new Date('2023-07-15'),
  },
  {
    id: 'supplier-009',
    name: 'Unilever - Hardline',
    code: '83790',
    isActive: true,
    contactEmail: 'hardline@unilever.com',
    contactPhone: '+66-2-890-1234',
    address: 'Bangkok, Thailand',
    createdAt: new Date('2023-08-01'),
  },
  {
    id: 'supplier-010',
    name: 'Unilever - Homeline',
    code: '34355',
    isActive: true,
    contactEmail: 'homeline@unilever.com',
    contactPhone: '+66-2-901-2345',
    address: 'Bangkok, Thailand',
    createdAt: new Date('2023-08-15'),
  },
  {
    id: 'supplier-011',
    name: 'Unilever - Personal Care',
    code: '34443',
    isActive: true,
    contactEmail: 'personalcare@unilever.com',
    contactPhone: '+66-2-012-3456',
    address: 'Bangkok, Thailand',
    createdAt: new Date('2023-09-01'),
  },
];

export const getActiveSuppliers = (): MockSupplier[] => {
  return mockSuppliers.filter(s => s.isActive);
};

export const getSupplierById = (id: string): MockSupplier | undefined => {
  return mockSuppliers.find(s => s.id === id);
};

export const getSupplierByCode = (code: string): MockSupplier | undefined => {
  return mockSuppliers.find(s => s.code === code);
};

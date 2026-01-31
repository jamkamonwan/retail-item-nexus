// Mock department data for design-first development

export interface MockDepartment {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: Date;
}

export const mockDepartments: MockDepartment[] = [
  {
    id: 'dept-001',
    name: 'Procurement',
    code: 'PROC',
    description: 'Purchasing and supplier management',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-002',
    name: 'Commercial',
    code: 'COMM',
    description: 'Commercial operations and pricing',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-003',
    name: 'Finance',
    code: 'FIN',
    description: 'Financial management and reporting',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-004',
    name: 'Supply Chain',
    code: 'SCM',
    description: 'Supply chain and logistics',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-005',
    name: 'Inventory Management',
    code: 'IM',
    description: 'Inventory control and warehouse',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-006',
    name: 'DC Operations',
    code: 'DC',
    description: 'Distribution center operations',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-007',
    name: 'NSD',
    code: 'NSD',
    description: 'New store development',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'dept-008',
    name: 'IT',
    code: 'IT',
    description: 'Information technology',
    createdAt: new Date('2023-01-01'),
  },
];

export const getDepartmentByCode = (code: string): MockDepartment | undefined => {
  return mockDepartments.find(d => d.code === code);
};

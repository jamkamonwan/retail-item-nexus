// Mock NPD submission data for design-first development
import { MockRole } from './users';

export type MockDivision = 'HL' | 'DF' | 'SL' | 'FF' | 'GS' | 'HB';
export type MockWorkflowStatus = 
  | 'draft'
  | 'pending_buyer'
  | 'pending_commercial'
  | 'pending_finance'
  | 'pending_secondary'
  | 'approved'
  | 'rejected'
  | 'revision_needed';

export interface MockHistoryEntry {
  id: string;
  fromStatus: MockWorkflowStatus | null;
  toStatus: MockWorkflowStatus;
  action: string;
  performedBy: string;
  performedByRole: MockRole;
  comment?: string;
  createdAt: Date;
}

export interface MockSubmission {
  id: string;
  division: MockDivision;
  status: MockWorkflowStatus;
  productNameTh: string;
  productNameEn: string;
  barcode: string;
  supplierId: string;
  supplierName: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  formData: Record<string, string | number | null>;
  history: MockHistoryEntry[];
}

export const mockSubmissions: MockSubmission[] = [
  {
    id: 'sub-001',
    division: 'HL',
    status: 'draft',
    productNameTh: 'น้ำส้มคั้นสด 100%',
    productNameEn: 'Fresh Orange Juice 100%',
    barcode: '8851234567890',
    supplierId: 'supplier-001',
    supplierName: 'ACME Corporation',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25'),
    formData: {
      brand: 'ACME Fresh',
      packSize: '1L',
      shelfLife: '30',
      storageTemp: '2-8°C',
    },
    history: [],
  },
  {
    id: 'sub-002',
    division: 'HL',
    status: 'pending_buyer',
    productNameTh: 'โยเกิร์ตรสสตรอเบอร์รี่',
    productNameEn: 'Strawberry Yogurt',
    barcode: '8851234567891',
    supplierId: 'supplier-002',
    supplierName: 'Global Foods Ltd',
    createdBy: 'user-supplier-002',
    createdByName: 'Jane Vendor',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-22'),
    submittedAt: new Date('2025-01-22'),
    formData: {
      brand: 'Global Dairy',
      packSize: '150g',
      shelfLife: '14',
      storageTemp: '2-8°C',
      category: 'Dairy',
    },
    history: [
      {
        id: 'hist-001',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-002',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-22'),
      },
    ],
  },
  {
    id: 'sub-003',
    division: 'DF',
    status: 'pending_commercial',
    productNameTh: 'ขนมปังโฮลวีท',
    productNameEn: 'Whole Wheat Bread',
    barcode: '8851234567892',
    supplierId: 'supplier-003',
    supplierName: 'Fresh Produce Co',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-24'),
    submittedAt: new Date('2025-01-19'),
    formData: {
      brand: 'Fresh Bakery',
      packSize: '400g',
      shelfLife: '5',
      storageTemp: 'Room temperature',
      category: 'Bakery',
    },
    history: [
      {
        id: 'hist-002',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-19'),
      },
      {
        id: 'hist-003',
        fromStatus: 'pending_buyer',
        toStatus: 'pending_commercial',
        action: 'approve',
        performedBy: 'user-buyer-001',
        performedByRole: 'buyer',
        comment: 'Meets quality standards',
        createdAt: new Date('2025-01-24'),
      },
    ],
  },
  {
    id: 'sub-004',
    division: 'SL',
    status: 'pending_finance',
    productNameTh: 'น้ำมันมะกอก Extra Virgin',
    productNameEn: 'Extra Virgin Olive Oil',
    barcode: '8851234567893',
    supplierId: 'supplier-004',
    supplierName: 'Premium Imports',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-28'),
    submittedAt: new Date('2025-01-11'),
    formData: {
      brand: 'Premium Select',
      packSize: '500ml',
      shelfLife: '365',
      storageTemp: 'Room temperature',
      category: 'Cooking Oil',
      retailPrice: '299',
    },
    history: [
      {
        id: 'hist-004',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-11'),
      },
      {
        id: 'hist-005',
        fromStatus: 'pending_buyer',
        toStatus: 'pending_commercial',
        action: 'approve',
        performedBy: 'user-buyer-001',
        performedByRole: 'buyer',
        createdAt: new Date('2025-01-20'),
      },
      {
        id: 'hist-006',
        fromStatus: 'pending_commercial',
        toStatus: 'pending_finance',
        action: 'approve',
        performedBy: 'user-commercial-001',
        performedByRole: 'commercial',
        comment: 'Pricing approved',
        createdAt: new Date('2025-01-28'),
      },
    ],
  },
  {
    id: 'sub-005',
    division: 'FF',
    status: 'approved',
    productNameTh: 'ไก่ทอดแช่แข็ง',
    productNameEn: 'Frozen Fried Chicken',
    barcode: '8851234567894',
    supplierId: 'supplier-002',
    supplierName: 'Global Foods Ltd',
    createdBy: 'user-supplier-002',
    createdByName: 'Jane Vendor',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-25'),
    submittedAt: new Date('2025-01-06'),
    approvedAt: new Date('2025-01-25'),
    formData: {
      brand: 'Global Frozen',
      packSize: '500g',
      shelfLife: '180',
      storageTemp: '-18°C',
      category: 'Frozen Food',
      retailPrice: '159',
    },
    history: [
      {
        id: 'hist-007',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-002',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-06'),
      },
      {
        id: 'hist-008',
        fromStatus: 'pending_buyer',
        toStatus: 'pending_commercial',
        action: 'approve',
        performedBy: 'user-buyer-001',
        performedByRole: 'buyer',
        createdAt: new Date('2025-01-12'),
      },
      {
        id: 'hist-009',
        fromStatus: 'pending_commercial',
        toStatus: 'pending_finance',
        action: 'approve',
        performedBy: 'user-commercial-001',
        performedByRole: 'commercial',
        createdAt: new Date('2025-01-18'),
      },
      {
        id: 'hist-010',
        fromStatus: 'pending_finance',
        toStatus: 'approved',
        action: 'approve',
        performedBy: 'user-finance-001',
        performedByRole: 'finance',
        comment: 'Final approval granted',
        createdAt: new Date('2025-01-25'),
      },
    ],
  },
  {
    id: 'sub-006',
    division: 'GS',
    status: 'rejected',
    productNameTh: 'ผงซักฟอกสูตรเข้มข้น',
    productNameEn: 'Concentrated Laundry Detergent',
    barcode: '8851234567895',
    supplierId: 'supplier-001',
    supplierName: 'ACME Corporation',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-15'),
    submittedAt: new Date('2025-01-09'),
    formData: {
      brand: 'ACME Clean',
      packSize: '2kg',
      shelfLife: '730',
      storageTemp: 'Room temperature',
      category: 'Household',
    },
    history: [
      {
        id: 'hist-011',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-09'),
      },
      {
        id: 'hist-012',
        fromStatus: 'pending_buyer',
        toStatus: 'rejected',
        action: 'reject',
        performedBy: 'user-buyer-002',
        performedByRole: 'buyer',
        comment: 'Similar product already exists in our assortment',
        createdAt: new Date('2025-01-15'),
      },
    ],
  },
  {
    id: 'sub-007',
    division: 'HB',
    status: 'revision_needed',
    productNameTh: 'แชมพูสระผมสูตรธรรมชาติ',
    productNameEn: 'Natural Hair Shampoo',
    barcode: '8851234567896',
    supplierId: 'supplier-005',
    supplierName: 'Thai Organic Farm',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-26'),
    submittedAt: new Date('2025-01-13'),
    formData: {
      brand: 'Thai Organic',
      packSize: '300ml',
      shelfLife: '365',
      storageTemp: 'Room temperature',
      category: 'Personal Care',
    },
    history: [
      {
        id: 'hist-013',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-13'),
      },
      {
        id: 'hist-014',
        fromStatus: 'pending_buyer',
        toStatus: 'revision_needed',
        action: 'request_revision',
        performedBy: 'user-buyer-001',
        performedByRole: 'buyer',
        comment: 'Please provide FDA registration number',
        createdAt: new Date('2025-01-26'),
      },
    ],
  },
  {
    id: 'sub-008',
    division: 'HL',
    status: 'pending_secondary',
    productNameTh: 'นมถั่วเหลืองออร์แกนิค',
    productNameEn: 'Organic Soy Milk',
    barcode: '8851234567897',
    supplierId: 'supplier-005',
    supplierName: 'Thai Organic Farm',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-29'),
    submittedAt: new Date('2025-01-16'),
    formData: {
      brand: 'Thai Organic',
      packSize: '1L',
      shelfLife: '60',
      storageTemp: '2-8°C',
      category: 'Beverages',
      retailPrice: '65',
    },
    history: [
      {
        id: 'hist-015',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-16'),
      },
      {
        id: 'hist-016',
        fromStatus: 'pending_buyer',
        toStatus: 'pending_commercial',
        action: 'approve',
        performedBy: 'user-buyer-001',
        performedByRole: 'buyer',
        createdAt: new Date('2025-01-22'),
      },
      {
        id: 'hist-017',
        fromStatus: 'pending_commercial',
        toStatus: 'pending_secondary',
        action: 'forward',
        performedBy: 'user-commercial-001',
        performedByRole: 'commercial',
        comment: 'Needs SCM review for logistics',
        createdAt: new Date('2025-01-29'),
      },
    ],
  },
  {
    id: 'sub-009',
    division: 'DF',
    status: 'draft',
    productNameTh: 'คุกกี้ช็อคโกแลตชิพ',
    productNameEn: 'Chocolate Chip Cookies',
    barcode: '8851234567898',
    supplierId: 'supplier-003',
    supplierName: 'Fresh Produce Co',
    createdBy: 'user-supplier-002',
    createdByName: 'Jane Vendor',
    createdAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-01-28'),
    formData: {
      brand: 'Fresh Bakery',
      packSize: '200g',
    },
    history: [],
  },
  {
    id: 'sub-010',
    division: 'SL',
    status: 'pending_buyer',
    productNameTh: 'ซอสพริกศรีราชา',
    productNameEn: 'Sriracha Hot Sauce',
    barcode: '8851234567899',
    supplierId: 'supplier-001',
    supplierName: 'ACME Corporation',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-27'),
    updatedAt: new Date('2025-01-29'),
    submittedAt: new Date('2025-01-29'),
    formData: {
      brand: 'ACME Spicy',
      packSize: '450ml',
      shelfLife: '365',
      storageTemp: 'Room temperature',
      category: 'Condiments',
      retailPrice: '89',
    },
    history: [
      {
        id: 'hist-018',
        fromStatus: 'draft',
        toStatus: 'pending_buyer',
        action: 'submit',
        performedBy: 'user-supplier-001',
        performedByRole: 'supplier',
        createdAt: new Date('2025-01-29'),
      },
    ],
  },
];

// Helper functions
export const getSubmissionsByStatus = (status: MockWorkflowStatus): MockSubmission[] => {
  return mockSubmissions.filter(s => s.status === status);
};

export const getSubmissionsBySupplier = (supplierId: string): MockSubmission[] => {
  return mockSubmissions.filter(s => s.supplierId === supplierId);
};

export const getSubmissionsByDivision = (division: MockDivision): MockSubmission[] => {
  return mockSubmissions.filter(s => s.division === division);
};

export const getSubmissionById = (id: string): MockSubmission | undefined => {
  return mockSubmissions.find(s => s.id === id);
};

export const getPendingForRole = (role: MockRole): MockSubmission[] => {
  const statusMap: Partial<Record<MockRole, MockWorkflowStatus>> = {
    buyer: 'pending_buyer',
    commercial: 'pending_commercial',
    finance: 'pending_finance',
  };
  
  const targetStatus = statusMap[role];
  if (!targetStatus) return [];
  
  return mockSubmissions.filter(s => s.status === targetStatus);
};

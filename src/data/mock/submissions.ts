// Mock NPD submission data for design-first development
import { MockRole } from './users';

// Extended MockDivision to match npd.ts Division type
export type MockDivision = 'HL' | 'HOL' | 'DF' | 'NF' | 'SL' | 'FF' | 'GS' | 'HB' | 'PH';

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

// ============================================================
// Sample Submission with Full 80-Field Data (DF Division - Food)
// ============================================================
const sampleFullFormData: Record<string, string | number | null> = {
  // Product Identification (15 fields)
  barcode: '8851234567890',
  product_name_th: 'น้ำส้มคั้นสด 100%',
  product_name_en: 'Fresh Orange Juice 100%',
  category: 'Food & Beverage',
  sub_category: 'Beverages',
  brand: 'ACME Fresh',
  model: 'OJ-FRESH-1L',
  supplier_code: 'ACM-OJ-001',
  supplier_name: 'ACME Corporation',
  department: 'DF',
  item_type: 'New Item',
  product_type: 'Regular',
  sales_channel: 'Omnichannel',
  season_code: null,
  article_number: 'ART-2025-0001',
  
  // Basic Attributes (20 fields)
  size: '1000ml',
  color: null,
  weight_net: 1050,
  weight_gross: 1100,
  dimension_l: 8,
  dimension_w: 8,
  dimension_h: 26,
  material: null,
  country_origin: 'Thailand',
  manufacturer: 'ACME Foods Co., Ltd.',
  pack_size: '6x1L',
  pack_type: 'Bottle',
  shelf_life_days: 30,
  storage_condition: 'Refrigerated',
  storage_temp: '2-8°C (Chill)',
  ingredients: 'Orange juice 100%, Vitamin C',
  allergen_info: 'No known allergens',
  nutrition_info: 'Calories: 45 per 100ml, Sugar: 9g, Vitamin C: 50% DV',
  usage_instructions: 'Shake well before serving. Refrigerate after opening.',
  warning_text: 'Best served chilled. Consume within 3 days after opening.',
  
  // Compliance (10 fields)
  tisi_number: null,
  tisi_expiry: null,
  fda_number: '10-1-12345-1-0001',
  fda_expiry: '2027-12-31',
  halal_cert: 'Halal Certified',
  organic_cert: 'Not Applicable',
  iso_cert: 'ISO 22000:2018',
  other_cert: 'GMP, HACCP',
  product_license: null,
  test_report: null,
  
  // Pricing (8 fields)
  cost_price: 35.00,
  cost_price_vat: 37.45,
  srp: 55.00,
  unit_measure: 'Bottle',
  qty_per_pack: 6,
  vat_type: 'VAT 7%',
  price_effective_date: '2025-02-01',
  promo_remarks: 'Launch promotion: Buy 2 Get 1 Free',
  
  // Logistics (20 fields)
  moq: 100,
  lead_time_days: 3,
  pack_per_layer: 8,
  layer_per_pallet: 5,
  pack_per_carton: 6,
  carton_dimension_l: 30,
  carton_dimension_w: 20,
  carton_dimension_h: 28,
  carton_weight: 7.2,
  cbm_per_carton: 0.0168, // Calculated: 30*20*28/1000000
  delivery_point: 'DC Central',
  incoterm: 'DDP',
  dc_delivery: 'Full Truck',
  cross_dock: 'No',
  return_policy: '7 Days',
  damage_allowance: 2,
  order_multiple: 10,
  safety_stock_days: 7,
  first_delivery_date: '2025-02-15',
  supplier_remarks: 'Temperature-controlled transport required.',
};

export const mockSubmissions: MockSubmission[] = [
  {
    id: 'sub-001',
    division: 'DF',
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
    formData: { ...sampleFullFormData },
    history: [],
  },
  {
    id: 'sub-002',
    division: 'DF',
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
      barcode: '8851234567891',
      product_name_th: 'โยเกิร์ตรสสตรอเบอร์รี่',
      product_name_en: 'Strawberry Yogurt',
      brand: 'Global Dairy',
      category: 'Food & Beverage',
      sub_category: 'Dairy',
      pack_size: '150g',
      shelf_life_days: 14,
      storage_temp: '2-8°C (Chill)',
      department: 'DF',
      cost_price: 18.00,
      srp: 29.00,
      moq: 200,
      lead_time_days: 2,
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
    division: 'FF',
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
      barcode: '8851234567892',
      product_name_th: 'ขนมปังโฮลวีท',
      product_name_en: 'Whole Wheat Bread',
      brand: 'Fresh Bakery',
      category: 'Food & Beverage',
      sub_category: 'Bakery',
      pack_size: '400g',
      shelf_life_days: 5,
      storage_temp: 'Room Temperature',
      department: 'FF',
      cost_price: 28.00,
      srp: 45.00,
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
    division: 'HL',
    status: 'pending_finance',
    productNameTh: 'พัดลมตั้งโต๊ะ 16 นิ้ว',
    productNameEn: '16-inch Desk Fan',
    barcode: '8851234567893',
    supplierId: 'supplier-004',
    supplierName: 'Premium Imports',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-28'),
    submittedAt: new Date('2025-01-11'),
    formData: {
      barcode: '8851234567893',
      product_name_th: 'พัดลมตั้งโต๊ะ 16 นิ้ว',
      product_name_en: '16-inch Desk Fan',
      brand: 'Premium Select',
      category: 'Electronics',
      sub_category: 'Appliances',
      size: '16 inch',
      color: 'White',
      weight_net: 3500,
      weight_gross: 4200,
      dimension_l: 45,
      dimension_w: 20,
      dimension_h: 50,
      material: 'ABS Plastic, Metal',
      country_origin: 'China',
      manufacturer: 'Premium Electronics Co., Ltd.',
      department: 'HL',
      tisi_number: 'มอก. 934-2558',
      cost_price: 450.00,
      srp: 790.00,
      moq: 50,
      lead_time_days: 14,
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
    division: 'SL',
    status: 'approved',
    productNameTh: 'เสื้อโปโลผู้ชาย',
    productNameEn: 'Mens Polo Shirt',
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
      barcode: '8851234567894',
      product_name_th: 'เสื้อโปโลผู้ชาย',
      product_name_en: 'Mens Polo Shirt',
      brand: 'Fashion Plus',
      category: 'Fashion',
      sub_category: 'Mens',
      size: 'S, M, L, XL',
      color: 'Navy Blue, White, Black',
      material: 'Cotton 100%',
      country_origin: 'Thailand',
      department: 'SL',
      season_code: 'SS25',
      cost_price: 180.00,
      srp: 350.00,
      moq: 100,
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
      barcode: '8851234567895',
      product_name_th: 'ผงซักฟอกสูตรเข้มข้น',
      product_name_en: 'Concentrated Laundry Detergent',
      brand: 'ACME Clean',
      category: 'Household',
      sub_category: 'Laundry',
      pack_size: '2kg',
      department: 'GS',
      cost_price: 85.00,
      srp: 159.00,
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
      barcode: '8851234567896',
      product_name_th: 'แชมพูสระผมสูตรธรรมชาติ',
      product_name_en: 'Natural Hair Shampoo',
      brand: 'Thai Organic',
      category: 'Beauty & Health',
      sub_category: 'Haircare',
      pack_size: '300ml',
      department: 'HB',
      fda_number: null, // Missing - reason for revision
      cost_price: 120.00,
      srp: 249.00,
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
    division: 'PH',
    status: 'pending_secondary',
    productNameTh: 'วิตามินซี 1000mg',
    productNameEn: 'Vitamin C 1000mg',
    barcode: '8851234567897',
    supplierId: 'supplier-005',
    supplierName: 'Thai Organic Farm',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-29'),
    submittedAt: new Date('2025-01-16'),
    formData: {
      barcode: '8851234567897',
      product_name_th: 'วิตามินซี 1000mg',
      product_name_en: 'Vitamin C 1000mg',
      brand: 'Thai Organic',
      category: 'Beauty & Health',
      sub_category: 'Supplements',
      pack_size: '60 tablets',
      shelf_life_days: 730,
      department: 'PH',
      fda_number: '13-1-05678-1-0001',
      cost_price: 180.00,
      srp: 350.00,
      moq: 50,
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
    division: 'HOL',
    status: 'draft',
    productNameTh: 'หมอนยางพารา',
    productNameEn: 'Natural Latex Pillow',
    barcode: '8851234567898',
    supplierId: 'supplier-003',
    supplierName: 'Fresh Produce Co',
    createdBy: 'user-supplier-002',
    createdByName: 'Jane Vendor',
    createdAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-01-28'),
    formData: {
      barcode: '8851234567898',
      product_name_th: 'หมอนยางพารา',
      product_name_en: 'Natural Latex Pillow',
      brand: 'Sleep Well',
      category: 'Home & Living',
      sub_category: 'Decor',
      department: 'HOL',
    },
    history: [],
  },
  {
    id: 'sub-010',
    division: 'NF',
    status: 'pending_buyer',
    productNameTh: 'น้ำยาล้างจาน',
    productNameEn: 'Dish Washing Liquid',
    barcode: '8851234567899',
    supplierId: 'supplier-001',
    supplierName: 'ACME Corporation',
    createdBy: 'user-supplier-001',
    createdByName: 'John Supplier',
    createdAt: new Date('2025-01-27'),
    updatedAt: new Date('2025-01-29'),
    submittedAt: new Date('2025-01-29'),
    formData: {
      barcode: '8851234567899',
      product_name_th: 'น้ำยาล้างจาน',
      product_name_en: 'Dish Washing Liquid',
      brand: 'ACME Clean',
      category: 'Household',
      sub_category: 'Cleaning',
      pack_size: '450ml',
      department: 'NF',
      cost_price: 25.00,
      srp: 45.00,
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

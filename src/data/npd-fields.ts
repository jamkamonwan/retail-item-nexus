import { NPDFormField, Division, UserType } from '@/types/npd';

// Helper function to check if a field applies to a division
export const appliesToDivision = (field: NPDFormField, division: Division): boolean => {
  if (field.applicableDivisions === 'all') return true;
  return field.applicableDivisions.includes(division);
};

// Core Product Fields - Basic Information Section
export const BASIC_INFO_FIELDS: NPDFormField[] = [
  {
    id: 'barcode',
    name: 'Barcode / PLU',
    nameTh: 'รหัสสินค้า',
    section: 'basic_info',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer'],
    maxLength: 20,
    placeholder: 'Enter barcode number',
  },
  {
    id: 'product_name_th',
    name: 'Product Name (Thai)',
    nameTh: 'ชื่อสินค้า ภาษาไทย',
    section: 'basic_info',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    maxLength: 30,
    placeholder: 'ชื่อสินค้าภาษาไทย',
  },
  {
    id: 'product_name_en',
    name: 'Product Name (English)',
    nameTh: 'ชื่อสินค้า ภาษาอังกฤษ',
    section: 'basic_info',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    maxLength: 30,
    placeholder: 'Product name in English',
  },
  {
    id: 'brand',
    name: 'Brand',
    nameTh: 'แบรนด์',
    section: 'basic_info',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Brand name',
  },
  {
    id: 'model',
    name: 'Model',
    nameTh: 'รุ่นสินค้า',
    section: 'basic_info',
    channel: 'both',
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: ['HL', 'SL', 'GS'],
    assignedTo: ['supplier', 'buyer'],
    placeholder: 'Model number/name',
  },
  {
    id: 'category',
    name: 'Category',
    nameTh: 'หมวดสินค้า',
    section: 'basic_info',
    channel: 'online',
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['Electronics', 'Home & Living', 'Food & Beverage', 'Beauty & Health', 'Fashion', 'Baby & Kids'],
  },
  {
    id: 'unit',
    name: 'Unit of Measure',
    nameTh: 'หน่วยขาย',
    section: 'basic_info',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['Piece', 'Pack', 'Set', 'Box', 'Kg', 'Liter'],
  },
];

// Product Specifications
export const SPECIFICATIONS_FIELDS: NPDFormField[] = [
  {
    id: 'pack_size',
    name: 'Pack Size',
    nameTh: 'ขนาดบรรจุ',
    section: 'specifications',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'e.g., 500ml, 1kg',
  },
  {
    id: 'shelf_life',
    name: 'Shelf Life (Days)',
    nameTh: 'อายุสินค้า (วัน)',
    section: 'specifications',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: ['DF', 'FF', 'HB'],
    assignedTo: ['supplier'],
    placeholder: 'Days',
  },
  {
    id: 'storage_temp',
    name: 'Storage Temperature',
    nameTh: 'อุณหภูมิเก็บรักษา',
    section: 'specifications',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: ['DF', 'FF'],
    assignedTo: ['supplier'],
    dropdownOptions: ['Room Temperature', '2-8°C (Chill)', '-18°C (Frozen)'],
  },
  {
    id: 'ingredients',
    name: 'Ingredients',
    nameTh: 'ส่วนประกอบ',
    section: 'specifications',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'textarea',
    applicableDivisions: ['DF', 'FF', 'HB'],
    assignedTo: ['supplier'],
    placeholder: 'List all ingredients',
  },
  {
    id: 'color',
    name: 'Color',
    nameTh: 'สี',
    section: 'specifications',
    channel: 'both',
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: ['HL', 'SL', 'GS', 'HB'],
    assignedTo: ['supplier'],
    placeholder: 'Product color',
  },
  {
    id: 'size_options',
    name: 'Size Options',
    nameTh: 'ขนาด',
    section: 'specifications',
    channel: 'both',
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: ['SL', 'HB'],
    assignedTo: ['supplier'],
    placeholder: 'S, M, L, XL',
  },
];

// Pricing Fields
export const PRICING_FIELDS: NPDFormField[] = [
  {
    id: 'cost_price',
    name: 'Cost Price',
    nameTh: 'ราคาต้นทุน',
    section: 'pricing',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer'],
    placeholder: '0.00',
  },
  {
    id: 'retail_price',
    name: 'Retail Price',
    nameTh: 'ราคาขายปลีก',
    section: 'pricing',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'commercial'],
    placeholder: '0.00',
  },
  {
    id: 'margin',
    name: 'Margin %',
    nameTh: 'มาร์จิ้น %',
    section: 'pricing',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['commercial', 'finance'],
    placeholder: '0',
  },
  {
    id: 'promo_price',
    name: 'Promotional Price',
    nameTh: 'ราคาโปรโมชั่น',
    section: 'pricing',
    channel: 'both',
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['commercial'],
    placeholder: '0.00',
  },
];

// Dimensions Fields
export const DIMENSIONS_FIELDS: NPDFormField[] = [
  {
    id: 'width',
    name: 'Width (cm)',
    nameTh: 'กว้าง (ซม.)',
    section: 'dimensions',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'height',
    name: 'Height (cm)',
    nameTh: 'สูง (ซม.)',
    section: 'dimensions',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'depth',
    name: 'Depth (cm)',
    nameTh: 'ลึก (ซม.)',
    section: 'dimensions',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'weight',
    name: 'Weight (kg)',
    nameTh: 'น้ำหนัก (กก.)',
    section: 'dimensions',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0.00',
  },
];

// Logistics Fields
export const LOGISTICS_FIELDS: NPDFormField[] = [
  {
    id: 'moq',
    name: 'MOQ (Minimum Order Qty)',
    nameTh: 'จำนวนสั่งขั้นต่ำ',
    section: 'logistics',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'scm'],
    placeholder: '1',
  },
  {
    id: 'lead_time',
    name: 'Lead Time (Days)',
    nameTh: 'ระยะเวลาส่งมอบ (วัน)',
    section: 'logistics',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'scm'],
    placeholder: '0',
  },
  {
    id: 'pack_qty',
    name: 'Pack Quantity',
    nameTh: 'จำนวนต่อแพ็ค',
    section: 'logistics',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '1',
  },
  {
    id: 'carton_qty',
    name: 'Carton Quantity',
    nameTh: 'จำนวนต่อลัง',
    section: 'logistics',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '1',
  },
];

// Product Images
export const PRODUCT_IMAGES_FIELDS: NPDFormField[] = [
  {
    id: 'main_image',
    name: 'Main Product Image',
    nameTh: 'รูปหลักสินค้า',
    section: 'product_images',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Upload main product image (JPEG/PNG, max 5MB)',
  },
  {
    id: 'alt_image_1',
    name: 'Alternative Image 1',
    nameTh: 'รูปเพิ่มเติม 1',
    section: 'product_images',
    channel: 'online',
    requirement: 'optional',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Upload additional product image',
  },
  {
    id: 'alt_image_2',
    name: 'Alternative Image 2',
    nameTh: 'รูปเพิ่มเติม 2',
    section: 'product_images',
    channel: 'online',
    requirement: 'optional',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
  },
];

// Compliance Fields
export const COMPLIANCE_FIELDS: NPDFormField[] = [
  {
    id: 'fda_number',
    name: 'FDA Registration',
    nameTh: 'เลขทะเบียน อย.',
    section: 'compliance',
    channel: 'both',
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['DF', 'FF', 'HB'],
    assignedTo: ['supplier'],
    placeholder: 'FDA registration number',
  },
  {
    id: 'certificate',
    name: 'Certificate',
    nameTh: 'ใบรับรอง',
    section: 'compliance',
    channel: 'both',
    requirement: 'optional',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Upload product certificate if available',
  },
  {
    id: 'country_of_origin',
    name: 'Country of Origin',
    nameTh: 'ประเทศผู้ผลิต',
    section: 'compliance',
    channel: 'both',
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Country name',
  },
];

// Store Allocation Fields
export const STORE_ALLOCATION_FIELDS: NPDFormField[] = [
  {
    id: 'store_type',
    name: 'Target Store Type',
    nameTh: 'ประเภทสาขาเป้าหมาย',
    section: 'store_allocation',
    channel: 'offline',
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'commercial'],
    dropdownOptions: ['All Stores', 'Hypermarket', 'Supermarket', 'Mini Store', 'Express'],
  },
  {
    id: 'target_stores',
    name: 'Number of Target Stores',
    nameTh: 'จำนวนสาขาเป้าหมาย',
    section: 'store_allocation',
    channel: 'offline',
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'commercial'],
    placeholder: '0',
  },
];

// Additional Information Fields
export const ADDITIONAL_FIELDS: NPDFormField[] = [
  {
    id: 'remarks',
    name: 'Remarks',
    nameTh: 'หมายเหตุ',
    section: 'additional',
    channel: 'both',
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer', 'commercial', 'finance'],
    placeholder: 'Any additional notes or comments',
  },
];

// Combine all fields
export const ALL_NPD_FIELDS: NPDFormField[] = [
  ...PRODUCT_IMAGES_FIELDS,
  ...BASIC_INFO_FIELDS,
  ...SPECIFICATIONS_FIELDS,
  ...PRICING_FIELDS,
  ...DIMENSIONS_FIELDS,
  ...LOGISTICS_FIELDS,
  ...COMPLIANCE_FIELDS,
  ...STORE_ALLOCATION_FIELDS,
  ...ADDITIONAL_FIELDS,
];

// Get fields by section
export const getFieldsBySection = (section: string): NPDFormField[] => {
  return ALL_NPD_FIELDS.filter(field => field.section === section);
};

// Get fields for a specific division
export const getFieldsForDivision = (division: Division): NPDFormField[] => {
  return ALL_NPD_FIELDS.filter(field => appliesToDivision(field, division));
};

// Get fields for a specific user type
export const getFieldsForUserType = (userType: UserType): NPDFormField[] => {
  return ALL_NPD_FIELDS.filter(field => field.assignedTo.includes(userType));
};

// Get fields for a specific context (division)
export const getFieldsForContext = (
  division: Division,
  _arg2?: unknown,
  _arg3?: unknown
): NPDFormField[] => {
  return ALL_NPD_FIELDS.filter(field => appliesToDivision(field, division));
};

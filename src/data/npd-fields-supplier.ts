// ============================================================
// Episode 1: Supplier Initial Product Registration (80 Fields)
// Complete field definitions for supplier product registration
// ============================================================

import { NPDFormField, Division, SupplierFormSection } from '@/types/npd';

// Categories and Sub-categories mapping
export const PRODUCT_CATEGORIES: Record<string, string[]> = {
  'Electronics': ['Audio', 'Video', 'Appliances', 'Accessories'],
  'Home & Living': ['Furniture', 'Kitchen', 'Decor', 'Storage'],
  'Food & Beverage': ['Beverages', 'Snacks', 'Dairy', 'Frozen', 'Bakery', 'Condiments'],
  'Beauty & Health': ['Skincare', 'Haircare', 'Personal Care', 'Supplements'],
  'Fashion': ['Mens', 'Womens', 'Kids', 'Accessories'],
  'Baby & Kids': ['Toys', 'Clothing', 'Feeding', 'Nursery'],
  'Grocery': ['Rice & Grains', 'Cooking Oil', 'Canned Food', 'Noodles'],
  'Household': ['Cleaning', 'Laundry', 'Paper Products', 'Pest Control'],
};

export const DEPARTMENTS: Record<string, string> = {
  HL: 'Hard Lines',
  HOL: 'Home & Living',
  DF: 'Dairy & Frozen',
  NF: 'Non-Food',
  SL: 'Soft Lines',
  FF: 'Fresh Food',
  PH: 'Pharmacy/Health',
  GS: 'General Store',
  HB: 'Health & Beauty',
};

export const COUNTRIES = [
  'Thailand', 'China', 'Japan', 'South Korea', 'Vietnam', 'Indonesia',
  'Malaysia', 'India', 'USA', 'Germany', 'France', 'Italy', 'Australia', 'Other'
];

export const PACK_TYPES = ['Box', 'Bag', 'Bottle', 'Can', 'Jar', 'Pouch', 'Tube', 'Tray', 'Blister', 'Sachet'];
export const STORAGE_CONDITIONS = ['Ambient', 'Cool & Dry', 'Refrigerated', 'Frozen', 'Controlled'];
export const STORAGE_TEMPS = ['Room Temperature', '2-8°C (Chill)', '-18°C (Frozen)', '15-25°C'];
export const UNIT_MEASURES = ['Piece', 'Pack', 'Set', 'Box', 'Kg', 'g', 'Liter', 'ml', 'Dozen'];
export const VAT_TYPES = ['VAT 7%', 'VAT Exempt', 'Zero VAT'];
export const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DDP', 'DAP'];
export const DELIVERY_POINTS = ['DC Central', 'DC Regional', 'Direct to Store', 'Cross Dock'];
export const DC_DELIVERY_METHODS = ['Full Truck', 'LTL', 'Milk Run', 'Express'];
export const RETURN_POLICIES = ['No Return', '7 Days', '14 Days', '30 Days', 'Damaged Only'];
export const HALAL_OPTIONS = ['Not Required', 'Halal Certified', 'Pending Certification'];
export const ORGANIC_OPTIONS = ['Not Applicable', 'USDA Organic', 'EU Organic', 'Local Organic'];
export const SALES_CHANNELS = ['Offline Only', 'Online Only', 'Omnichannel'];
export const ITEM_TYPES = ['New Item', 'Join Item', 'Re-Activate', 'Replacement'];
export const PRODUCT_TYPES = ['Regular', 'Seasonal', 'Promotional', 'Private Label', 'Exclusive'];

// ============================================================
// SECTION 1: Product Identification (15 fields)
// ============================================================
export const PRODUCT_IDENTIFICATION_FIELDS: NPDFormField[] = [
  {
    id: 'barcode',
    name: 'Barcode/EAN',
    nameTh: 'รหัสบาร์โค้ด',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    maxLength: 20,
    placeholder: '8851234567890',
    helpText: 'Enter 13-digit EAN barcode',
  },
  {
    id: 'product_name_th',
    name: 'Product Name (Thai)',
    nameTh: 'ชื่อสินค้า (ไทย)',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    maxLength: 100,
    placeholder: 'ชื่อสินค้าภาษาไทย',
  },
  {
    id: 'product_name_en',
    name: 'Product Name (English)',
    nameTh: 'ชื่อสินค้า (อังกฤษ)',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    maxLength: 100,
    placeholder: 'Product name in English',
  },
  {
    id: 'category',
    name: 'Category',
    nameTh: 'หมวดหมู่สินค้า',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column - Category selection
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: Object.keys(PRODUCT_CATEGORIES),
  },
  {
    id: 'sub_category',
    name: 'Sub-category',
    nameTh: 'หมวดหมู่ย่อย',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: [], // Dynamically populated based on category
  },
  {
    id: 'brand',
    name: 'Brand',
    nameTh: 'แบรนด์',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Brand name',
  },
  {
    id: 'model',
    name: 'Model/SKU',
    nameTh: 'รุ่น/รหัสสินค้า',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Model or SKU code',
  },
  {
    id: 'supplier_code',
    name: 'Supplier Item Code',
    nameTh: 'รหัสสินค้าซัพพลายเออร์',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Your internal product code',
  },
  {
    id: 'supplier_name',
    name: 'Supplier Name',
    nameTh: 'ชื่อซัพพลายเออร์',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'readonly',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Auto-populated from your account',
  },
  {
    id: 'department',
    name: 'Department',
    nameTh: 'แผนก',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: Object.keys(DEPARTMENTS),
  },
  {
    id: 'item_type',
    name: 'Item Type',
    nameTh: 'ประเภทรายการ',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ITEM_TYPES,
  },
  {
    id: 'product_type',
    name: 'Product Type',
    nameTh: 'ประเภทสินค้า',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: PRODUCT_TYPES,
  },
  {
    id: 'sales_channel',
    name: 'Sales Channel',
    nameTh: 'ช่องทางการขาย',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: SALES_CHANNELS,
  },
  {
    id: 'season_code',
    name: 'Season Code',
    nameTh: 'รหัสฤดูกาล',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: ['SL'],
    assignedTo: ['supplier'],
    placeholder: 'e.g., SS25, FW25',
  },
  {
    id: 'article_number',
    name: 'Article Number',
    nameTh: 'เลขที่ Article',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Internal article reference',
  },
  // NEW: Group By field for product grouping
  {
    id: 'group_by',
    name: 'Group By',
    nameTh: 'จัดกลุ่มโดย',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'dropdown',
    applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
    assignedTo: ['supplier'],
    dropdownOptions: ['None', 'Color', 'Size', 'Pattern'],
    helpText: 'Select grouping method for product variants',
  },
  // NEW: Conditional fields for grouping
  {
    id: 'group_name',
    name: 'Group Name',
    nameTh: 'ชื่อกลุ่ม',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
    assignedTo: ['supplier'],
    placeholder: 'Enter group name',
    conditionalOn: 'group_by:!None',
  },
  {
    id: 'sku_reference',
    name: 'SKU Reference',
    nameTh: 'อ้างอิง SKU',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
    assignedTo: ['supplier'],
    placeholder: 'Reference SKU for grouping',
    conditionalOn: 'group_by:!None',
  },
  {
    id: 'group_barcode',
    name: 'Group Barcode',
    nameTh: 'บาร์โค้ดกลุ่ม',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
    assignedTo: ['supplier'],
    placeholder: 'Group barcode (optional)',
    conditionalOn: 'group_by:!None',
  },
  {
    id: 'seller',
    name: 'Seller',
    nameTh: 'ผู้ขาย',
    section: 'product_identification',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Seller name',
  },
];

// ============================================================
// SECTION 2: Product Images (7 fields)
// ============================================================
export const PRODUCT_IMAGES_FIELDS: NPDFormField[] = [
  {
    id: 'image_front',
    name: 'Front View (Images 1)',
    nameTh: 'รูปด้านหน้า',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column - All images are online
    requirement: 'mandatory',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Main product image, 1400x1400px recommended',
  },
  {
    id: 'image_back',
    name: 'Back View (Images 2)',
    nameTh: 'รูปด้านหลัง',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Show ingredients/nutrition for food products',
  },
  {
    id: 'image_side',
    name: 'Side View (Images 3)',
    nameTh: 'รูปด้านข้าง',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: '1400x1400px, white background',
  },
  {
    id: 'image_detail',
    name: 'Detail/Zoom (Images 4)',
    nameTh: 'รูปรายละเอียด',
    section: 'product_images',
    channel: 'online',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'file',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Close-up of key features, 1400x1400px',
  },
  {
    id: 'image_tisi',
    name: 'TISI Certificate (Images 5)',
    nameTh: 'รูป มอก.',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'file',
    applicableDivisions: ['HL', 'HOL'],
    assignedTo: ['supplier'],
    conditionalOn: 'tisi_number',
    helpText: 'TISI mark on product label, 1400x1400px',
  },
  {
    id: 'image_fda',
    name: 'FDA Registration (Images 6)',
    nameTh: 'รูป อย.',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'file',
    applicableDivisions: ['NF', 'PH'],
    assignedTo: ['supplier'],
    conditionalOn: 'fda_number',
    helpText: 'FDA mark on product, 1400x1400px',
  },
  {
    id: 'image_size_chart',
    name: 'Size Chart (Images 7)',
    nameTh: 'ตารางไซส์',
    section: 'product_images',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'file',
    applicableDivisions: ['SL'],
    assignedTo: ['supplier'],
    helpText: 'Size chart for clothing/footwear, 1400x1400px',
  },
  {
    id: 'youtube_link',
    name: 'YouTube Link',
    nameTh: 'ลิงก์ YouTube',
    section: 'product_images',
    channel: 'online',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'https://youtube.com/watch?v=...',
    helpText: 'Product video link',
  },
  {
    id: 'picture_image_name',
    name: 'Picture + Image Name',
    nameTh: 'ชื่อไฟล์รูปภาพ',
    section: 'product_images',
    channel: 'online',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'product_001.jpg',
    helpText: 'Image filename for reference',
  },
  {
    id: 'additional_images_link',
    name: 'Link to Additional Images',
    nameTh: 'ลิงก์รูปภาพเพิ่มเติม',
    section: 'product_images',
    channel: 'online',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'https://drive.google.com/...',
    helpText: 'Link to additional product images',
  },
];

// ============================================================
// SECTION 3: Basic Attributes (Fields with channelColumn)
// ============================================================
export const BASIC_ATTRIBUTES_FIELDS: NPDFormField[] = [
  {
    id: 'size',
    name: 'Size',
    nameTh: 'ขนาด',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column - Size Number
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'e.g., 500ml, L, 42',
  },
  {
    id: 'color',
    name: 'Color / Shade',
    nameTh: 'สี / เฉดสี',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: ['SL', 'HL', 'GS', 'HB', 'HOL', 'NF'],
    assignedTo: ['supplier'],
    placeholder: 'Product color',
  },
  {
    id: 'hex_color_code',
    name: 'Hex Color Code',
    nameTh: 'รหัสสี Hex (#000000)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['NF'],
    assignedTo: ['supplier'],
    placeholder: '#FFFFFF',
    conditionalOn: 'color',
    helpText: 'For beauty products with special shades',
  },
  {
    id: 'weight_net',
    name: 'Net Weight (g)',
    nameTh: 'น้ำหนักสุทธิ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'number',
    applicableDivisions: ['NF', 'PH'],
    assignedTo: ['supplier'],
    placeholder: '0',
    helpText: 'For products with contents in container',
  },
  {
    id: 'weight_gross',
    name: 'Gross Weight (kg)',
    nameTh: 'น้ำหนักรวม (กก.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'dimension_l',
    name: 'Length (cm)',
    nameTh: 'ความยาว (ซม.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'dimension_w',
    name: 'Width (cm)',
    nameTh: 'ความกว้าง (ซม.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'dimension_h',
    name: 'Height (cm)',
    nameTh: 'ความสูง (ซม.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'dimension_depth',
    name: 'Depth (cm)',
    nameTh: 'ความลึก (ซม.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'material',
    name: 'Material',
    nameTh: 'วัสดุ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: ['SL', 'HL', 'GS', 'HOL'],
    assignedTo: ['supplier'],
    placeholder: 'e.g., Cotton 100%, Stainless Steel',
  },
  // Size Standard - conditional on size field
  {
    id: 'size_standard',
    name: 'Size Standard',
    nameTh: 'มาตรฐานไซส์',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['Thai Standard', 'US Standard', 'EU Standard', 'UK Standard', 'Asian Standard'],
    conditionalOn: 'size',
    helpText: 'Size standard for clothing/footwear',
  },
  {
    id: 'country_origin',
    name: 'Country of Origin',
    nameTh: 'ประเทศผู้ผลิต',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: COUNTRIES,
  },
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    nameTh: 'ผู้ผลิต',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Manufacturing company name',
  },
  {
    id: 'pack_size',
    name: 'Pack Size',
    nameTh: 'ขนาดบรรจุ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'e.g., 6x500ml, 12pcs/pack',
  },
  {
    id: 'pack_type',
    name: 'Pack Type',
    nameTh: 'ประเภทบรรจุภัณฑ์',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: PACK_TYPES,
  },
  {
    id: 'shelf_life_days',
    name: 'Shelf Life (Days)',
    nameTh: 'อายุสินค้า (วัน)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: ['DF', 'FF', 'HB', 'PH'],
    assignedTo: ['supplier'],
    placeholder: '0',
    helpText: 'Number of days from production date',
  },
  {
    id: 'shelf_life_consumer',
    name: 'Shelf Life % Consumer',
    nameTh: 'อายุสินค้า % ผู้บริโภค',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '70%',
  },
  {
    id: 'storage_condition',
    name: 'Storage Condition',
    nameTh: 'วิธีการเก็บรักษา',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column - Care Instruction
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Storage instructions',
  },
  {
    id: 'storage_temp',
    name: 'Storage Temperature',
    nameTh: 'อุณหภูมิเก็บรักษา',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: STORAGE_TEMPS,
  },
  {
    id: 'ingredients',
    name: 'Ingredients',
    nameTh: 'ส่วนประกอบ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'textarea',
    applicableDivisions: ['DF', 'NF', 'FF', 'PH'],
    assignedTo: ['supplier'],
    placeholder: 'List all ingredients in descending order by weight',
  },
  {
    id: 'allergen_info',
    name: 'Allergen Information',
    nameTh: 'ข้อมูลสำหรับผู้แพ้อาหาร',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'textarea',
    applicableDivisions: ['DF', 'FF'],
    assignedTo: ['supplier'],
    placeholder: 'Contains: Milk, Wheat, Soy, etc.',
  },
  {
    id: 'warranty_th',
    name: 'Warranty (Thai)',
    nameTh: 'การรับประกัน (ไทย)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'e.g., 1 ปี',
  },
  {
    id: 'warranty_en',
    name: 'Warranty (English)',
    nameTh: 'การรับประกัน (อังกฤษ)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'e.g., 1 Year',
  },
  {
    id: 'condition_remark_en',
    name: 'Condition/Remark (English)',
    nameTh: 'เงื่อนไข/หมายเหตุ (อังกฤษ)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Additional conditions or remarks',
  },
  {
    id: 'gender',
    name: 'Gender',
    nameTh: 'เพศ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: ['SL', 'NF'],
    assignedTo: ['supplier'],
    dropdownOptions: ['Unisex', 'Male', 'Female', 'Kids'],
  },
  {
    id: 'age_range',
    name: 'Age Range',
    nameTh: 'ช่วงอายุ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column - Filter Age Range
    requirement: 'optional',
    inputType: 'dropdown',
    applicableDivisions: ['DF', 'NF', 'SL'],
    assignedTo: ['supplier'],
    dropdownOptions: ['0-6 months', '6-12 months', '1-3 years', '3-6 years', '6-12 years', 'Teen', 'Adult', 'Senior'],
  },
  {
    id: 'product_detail_th',
    name: 'Product Detail (Thai)',
    nameTh: 'คุณสมบัติ (ภาษาไทย)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Product features and benefits in Thai',
  },
  {
    id: 'product_detail_en',
    name: 'Product Detail (English)',
    nameTh: 'คุณสมบัติ (ภาษาอังกฤษ)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Product features and benefits in English',
  },
  {
    id: 'unit_measure_name',
    name: 'Unit of Measure Name',
    nameTh: 'หน่วยของสินค้า',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'both', // Offline/Online Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: UNIT_MEASURES,
  },
  {
    id: 'dimension_unit',
    name: 'Dimension Unit',
    nameTh: 'หน่วย Dimension',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['cm', 'mm', 'inch', 'm'],
  },
  {
    id: 'package_dimension',
    name: 'Package Dimension',
    nameTh: 'ขนาดหีบห่อ',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['Small', 'Medium', 'Large', 'Extra Large'],
  },
  {
    id: 'package_weight',
    name: 'Package Weight (kg)',
    nameTh: 'น้ำหนักหีบห่อ (กก.)',
    section: 'basic_attributes',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
];

// ============================================================
// SECTION 4: Compliance & Certification (Fields with channelColumn)
// ============================================================
export const COMPLIANCE_FIELDS: NPDFormField[] = [
  {
    id: 'tisi_number',
    name: 'TISI Number',
    nameTh: 'เลข มอก.',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: ['HL', 'HOL', 'SL', 'NF'],
    assignedTo: ['supplier'],
    placeholder: 'มอก. XXXX-XXXX',
  },
  {
    id: 'fda_number',
    name: 'FDA Number',
    nameTh: 'เลข อย. / ใบจดแจ้ง',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: ['DF', 'NF', 'PH', 'FF'],
    assignedTo: ['supplier'],
    placeholder: 'XX-X-XXXXX-X-XXXX',
  },
  {
    id: 'kho_pho_number',
    name: 'Kho Pho / Kho Ao Number',
    nameTh: 'เลข ฆพ / ฆอ',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: ['PH'],
    assignedTo: ['supplier'],
    placeholder: 'ฆพ./ฆอ. number',
  },
  {
    id: 'wos_number',
    name: 'WOS Number',
    nameTh: 'วอส.',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'mandatory',
    inputType: 'text',
    applicableDivisions: ['NF'],
    assignedTo: ['supplier'],
    placeholder: 'WOS number',
  },
  {
    id: 'pet_food_license',
    name: 'Pet Food License',
    nameTh: 'เลขทะเบียนอาหารสัตว์',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'conditional',
    inputType: 'text',
    applicableDivisions: ['NF'],
    assignedTo: ['supplier'],
    placeholder: 'Pet food registration number',
  },
  {
    id: 'safety_stock',
    name: 'Safety Stock',
    nameTh: 'Safety Stock',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Safety stock quantity',
  },
  {
    id: 'inner_pack_qty',
    name: 'Qty piece per Inner Pack',
    nameTh: 'จำนวนชิ้นในแพ็คย่อย',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'inner_per_purchase',
    name: 'Qty Inner Pack per Purchase Pack',
    nameTh: 'จำนวนแพ็คย่อยใน 1 ลัง',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'inner_dimension_l',
    name: 'Inner Pack Length (cm)',
    nameTh: 'ขนาดแพ็คย่อย - ยาว (ซม.)',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'inner_dimension_w',
    name: 'Inner Pack Width (cm)',
    nameTh: 'ขนาดแพ็คย่อย - กว้าง (ซม.)',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'inner_dimension_h',
    name: 'Inner Pack Height (cm)',
    nameTh: 'ขนาดแพ็คย่อย - สูง (ซม.)',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'inner_weight',
    name: 'Inner Pack Weight (kg)',
    nameTh: 'น้ำหนักแพ็คย่อย (กก.)',
    section: 'compliance',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
];

// ============================================================
// SECTION 5: Pricing Basics (Fields with channelColumn)
// ============================================================
export const PRICING_FIELDS: NPDFormField[] = [
  {
    id: 'vat_status',
    name: 'VAT Status',
    nameTh: 'สถานะ VAT ซื้อ',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    dropdownOptions: ['VAT', 'Non VAT'],
  },
  {
    id: 'cost_price',
    name: 'Cost Price (excl. VAT)',
    nameTh: 'ราคาทุนปกติ (ไม่รวม VAT)',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    placeholder: '0.00',
  },
  {
    id: 'cost_price_promo',
    name: 'Promotion Cost (excl. VAT)',
    nameTh: 'ราคาทุนจัดรายการ (ไม่รวม VAT)',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    placeholder: '0.00',
  },
  {
    id: 'sales_price',
    name: 'Sales Price (incl. VAT)',
    nameTh: 'ราคาขาย (รวม VAT)',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    placeholder: '0.00',
  },
  {
    id: 'normal_gp',
    name: 'Normal GP%',
    nameTh: 'GP% ปกติ',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column - Auto calculated
    requirement: 'optional',
    inputType: 'calculated',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
  },
  {
    id: 'gp_for_bas',
    name: 'GP% for BAS/Con',
    nameTh: 'GP% สำหรับ BAS/Con',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    dropdownOptions: ['5%', '10%', '15%', '20%', '25%', '30%'],
  },
  {
    id: 'promo_period',
    name: 'Promotion Period',
    nameTh: 'วันที่ทุนจัดรายการ เริ่ม-สิ้นสุด',
    section: 'pricing',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    dropdownOptions: ['Q1', 'Q2', 'Q3', 'Q4', 'Full Year'],
  },
];

// ============================================================
// SECTION 6: Logistics & Supply Chain (Fields with channelColumn)
// ============================================================
export const LOGISTICS_FIELDS: NPDFormField[] = [
  {
    id: 'moq',
    name: 'Minimum Order Qty',
    nameTh: 'จำนวนสั่งซื้อขั้นต่ำ',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '1',
  },
  {
    id: 'lead_time_days',
    name: 'Lead Time (Days)',
    nameTh: 'ระยะเวลาจัดส่ง (วัน)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'pack_per_layer',
    name: 'Packs per Layer',
    nameTh: 'จำนวนต่อชั้น',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'layer_per_pallet',
    name: 'Layers per Pallet',
    nameTh: 'จำนวนชั้นต่อ Pallet',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'pack_per_carton',
    name: 'Packs per Carton',
    nameTh: 'จำนวนต่อลัง',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'carton_dimension_l',
    name: 'Carton Length (cm)',
    nameTh: 'ความยาวลัง (ซม.)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'carton_dimension_w',
    name: 'Carton Width (cm)',
    nameTh: 'ความกว้างลัง (ซม.)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'carton_dimension_h',
    name: 'Carton Height (cm)',
    nameTh: 'ความสูงลัง (ซม.)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'carton_weight',
    name: 'Carton Weight (kg)',
    nameTh: 'น้ำหนักลัง (กก.)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0.00',
  },
  {
    id: 'cbm_per_carton',
    name: 'CBM per Carton',
    nameTh: 'ปริมาตรต่อลัง',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column - Auto calculated
    requirement: 'optional',
    inputType: 'calculated',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    helpText: 'Auto-calculated from carton dimensions',
  },
  {
    id: 'delivery_point',
    name: 'Delivery Point',
    nameTh: 'จุดส่งมอบ',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: DELIVERY_POINTS,
  },
  {
    id: 'incoterm',
    name: 'Incoterm',
    nameTh: 'เงื่อนไขการส่งมอบ',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: INCOTERMS,
  },
  {
    id: 'dc_delivery',
    name: 'DC Delivery Method',
    nameTh: 'วิธีจัดส่ง DC',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: DC_DELIVERY_METHODS,
  },
  {
    id: 'cross_dock',
    name: 'Cross Dock Required',
    nameTh: 'ต้องการ Cross Dock',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['No', 'Yes'],
  },
  {
    id: 'return_policy',
    name: 'Return Policy',
    nameTh: 'นโยบายคืนสินค้า',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: RETURN_POLICIES,
  },
  {
    id: 'damage_allowance',
    name: 'Damage Allowance (%)',
    nameTh: 'เปอร์เซ็นต์ความเสียหาย',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'order_multiple',
    name: 'Order Multiple',
    nameTh: 'จำนวนทวีคูณการสั่ง',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '1',
  },
  {
    id: 'safety_stock_days',
    name: 'Safety Stock (Days)',
    nameTh: 'สต็อกสำรอง (วัน)',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'number',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: '0',
  },
  {
    id: 'first_delivery_date',
    name: 'First Delivery Date',
    nameTh: 'วันส่งมอบครั้งแรก',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'date',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
  },
  {
    id: 'supplier_remarks',
    name: 'Supplier Remarks',
    nameTh: 'หมายเหตุซัพพลายเออร์',
    section: 'logistics',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Any additional notes or comments',
  },
];

// ============================================================
// SECTION 7: System Fields (Fields with channelColumn)
// ============================================================
export const SYSTEM_FIELDS: NPDFormField[] = [
  {
    id: 'lv',
    name: 'LV (Level)',
    nameTh: 'ระดับ',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'im'],
    dropdownOptions: ['1', '2', '3', '4', '5'],
    helpText: 'Product level classification',
  },
  {
    id: 'pog_round',
    name: 'POG Round',
    nameTh: 'รอบ POG',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'im'],
    placeholder: 'e.g., Q1-2025',
    helpText: 'Planogram round assignment',
  },
  {
    id: 'new_join_reactivate',
    name: 'New Item / Join Item / Re-Activate',
    nameTh: 'สินค้าใหม่ / เข้าร่วม / เปิดใหม่',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'mandatory',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    dropdownOptions: ['New Item', 'Join Item', 'Re-Activate'],
  },
  {
    id: 'extra_info',
    name: 'Extra Info',
    nameTh: 'ข้อมูลเพิ่มเติม',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier'],
    placeholder: 'Additional information about the product',
  },
  {
    id: 'import_product_type',
    name: 'Import Product Type',
    nameTh: 'ประเภทสินค้านำเข้า',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'dropdown',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer'],
    dropdownOptions: ['Local', 'Import', 'Local+Import'],
    helpText: 'Indicate if product is imported',
  },
  {
    id: 'plm_import',
    name: 'PLM/Import',
    nameTh: 'PLM/นำเข้า',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'text',
    applicableDivisions: 'all',
    assignedTo: ['buyer'],
    placeholder: 'PLM or Import reference',
  },
  {
    id: 'remark_online',
    name: 'Remark (Online)',
    nameTh: 'หมายเหตุ (ออนไลน์)',
    section: 'system_fields',
    channel: 'online',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer'],
    placeholder: 'Notes specific to online channel',
  },
  {
    id: 'remark_offline',
    name: 'Remark (Offline)',
    nameTh: 'หมายเหตุ (ออฟไลน์)',
    section: 'system_fields',
    channel: 'offline',
    channelColumn: 'offline', // Offline Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['supplier', 'buyer'],
    placeholder: 'Notes specific to offline channel',
  },
  {
    id: 'condition_remark_th',
    name: 'Condition/Remark (Thai)',
    nameTh: 'เงื่อนไข/หมายเหตุ (ไทย)',
    section: 'system_fields',
    channel: 'both',
    channelColumn: 'online', // Online Column
    requirement: 'optional',
    inputType: 'textarea',
    applicableDivisions: 'all',
    assignedTo: ['buyer', 'commercial'],
    placeholder: 'Special conditions or remarks in Thai',
  },
];

// ============================================================
// Combined Exports
// ============================================================
export const ALL_SUPPLIER_FIELDS: NPDFormField[] = [
  ...PRODUCT_IDENTIFICATION_FIELDS,
  ...PRODUCT_IMAGES_FIELDS,
  ...BASIC_ATTRIBUTES_FIELDS,
  ...COMPLIANCE_FIELDS,
  ...PRICING_FIELDS,
  ...LOGISTICS_FIELDS,
  ...SYSTEM_FIELDS,
];

// Helper to get fields by section
export const getSupplierFieldsBySection = (section: SupplierFormSection): NPDFormField[] => {
  switch (section) {
    case 'product_identification':
      return PRODUCT_IDENTIFICATION_FIELDS;
    case 'product_images':
      return PRODUCT_IMAGES_FIELDS;
    case 'basic_attributes':
      return BASIC_ATTRIBUTES_FIELDS;
    case 'compliance':
      return COMPLIANCE_FIELDS;
    case 'pricing':
      return PRICING_FIELDS;
    case 'logistics':
      return LOGISTICS_FIELDS;
    case 'system_fields':
      return SYSTEM_FIELDS;
    default:
      return [];
  }
};

// Get fields for a specific division
export const getSupplierFieldsForDivision = (division: Division): NPDFormField[] => {
  return ALL_SUPPLIER_FIELDS.filter(field => {
    if (field.applicableDivisions === 'all') return true;
    return field.applicableDivisions.includes(division);
  });
};

// Get fields for a specific section and division
export const getFieldsForSectionAndDivision = (
  section: SupplierFormSection,
  division: Division
): NPDFormField[] => {
  const sectionFields = getSupplierFieldsBySection(section);
  return sectionFields.filter(field => {
    if (field.applicableDivisions === 'all') return true;
    return field.applicableDivisions.includes(division);
  });
};

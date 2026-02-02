// NPD (New Product Development) Type Definitions
// Updated for Episode 1: Supplier Initial Product Registration (80 fields)

// Product Divisions - Different product categories
// Extended to include all retail divisions
export type Division = 'HL' | 'HOL' | 'DF' | 'NF' | 'SL' | 'FF' | 'GS' | 'HB' | 'PH';

export const DIVISIONS: Record<Division, { label: string; fullName: string; color: string; category: 'food' | 'non-food' | 'health' }> = {
  HL: { label: 'HL', fullName: 'Hard Lines', color: 'division-hl', category: 'non-food' },
  HOL: { label: 'HOL', fullName: 'Home & Living', color: 'division-hol', category: 'non-food' },
  DF: { label: 'DF', fullName: 'Dairy & Frozen', color: 'division-df', category: 'food' },
  NF: { label: 'NF', fullName: 'Non-Food', color: 'division-nf', category: 'non-food' },
  SL: { label: 'SL', fullName: 'Soft Lines', color: 'division-sl', category: 'non-food' },
  FF: { label: 'FF', fullName: 'Fresh Food', color: 'division-ff', category: 'food' },
  GS: { label: 'GS', fullName: 'General Store', color: 'division-gs', category: 'non-food' },
  HB: { label: 'HB', fullName: 'Health & Beauty', color: 'division-hb', category: 'health' },
  PH: { label: 'PH', fullName: 'Pharmacy/Health', color: 'division-ph', category: 'health' },
};

// User Types - Who is using the system
export type UserType = 'supplier' | 'buyer' | 'commercial' | 'finance' | 'scm' | 'im' | 'dc_income' | 'admin' | 'nsd';

export const USER_TYPES: Record<UserType, { label: string; description: string }> = {
  supplier: { label: 'Supplier', description: 'External supplier/vendor' },
  buyer: { label: 'Buyer', description: 'Internal buyer/merchandiser' },
  commercial: { label: 'Commercial', description: 'Commercial team' },
  finance: { label: 'Finance', description: 'Finance department' },
  scm: { label: 'SCM', description: 'Supply Chain Management' },
  im: { label: 'IM', description: 'Inventory Management' },
  dc_income: { label: 'DC Income', description: 'Distribution Center Income' },
  admin: { label: 'Administrator', description: 'System administrator' },
  nsd: { label: 'NSD', description: 'New Store Development' },
};

// Channel Type - Online vs Offline
export type ChannelType = 'online' | 'offline' | 'both';

// Field Requirement Type
export type FieldRequirement = 'mandatory' | 'optional' | 'conditional';

// Field Input Type - Extended with date, readonly, and calculated
export type FieldInputType = 'text' | 'number' | 'dropdown' | 'date' | 'file' | 'textarea' | 'readonly' | 'calculated';

// ============================================================
// Form Section Categories - Updated for Supplier Registration
// ============================================================

// Original Form Sections (for backward compatibility)
export type FormSection = 
  | 'product_images'
  | 'basic_info'
  | 'specifications'
  | 'pricing'
  | 'dimensions'
  | 'logistics'
  | 'compliance'
  | 'store_allocation'
  | 'additional';

// NEW: Supplier Registration Form Sections (7 sections, 286 fields per Excel spec)
export type SupplierFormSection = 
  | 'product_identification'  // 24 fields
  | 'product_images'          // 10 fields
  | 'basic_attributes'        // 109 fields
  | 'compliance'              // 17 fields
  | 'pricing'                 // 10 fields
  | 'logistics'               // 107 fields
  | 'system_fields';          // 9 fields

export const SUPPLIER_FORM_SECTIONS: Record<SupplierFormSection, { 
  title: string; 
  titleTh: string; 
  icon: string;
  fieldCount: number;
}> = {
  product_identification: { 
    title: 'Product Identification', 
    titleTh: 'ข้อมูลระบุสินค้า', 
    icon: 'package',
    fieldCount: 24,
  },
  product_images: { 
    title: 'Product Images', 
    titleTh: 'รูปภาพสินค้า', 
    icon: 'image',
    fieldCount: 10,
  },
  basic_attributes: { 
    title: 'Basic Attributes', 
    titleTh: 'คุณสมบัติพื้นฐาน', 
    icon: 'list',
    fieldCount: 109,
  },
  compliance: { 
    title: 'Compliance & Certification', 
    titleTh: 'การรับรองและใบอนุญาต', 
    icon: 'shield-check',
    fieldCount: 17,
  },
  pricing: { 
    title: 'Pricing Basics', 
    titleTh: 'ราคาและต้นทุน', 
    icon: 'dollar-sign',
    fieldCount: 10,
  },
  logistics: { 
    title: 'Logistics & Supply Chain', 
    titleTh: 'โลจิสติกส์และซัพพลายเชน', 
    icon: 'truck',
    fieldCount: 107,
  },
  system_fields: { 
    title: 'System Fields', 
    titleTh: 'ระบบและการจัดการ', 
    icon: 'settings',
    fieldCount: 9,
  },
};

// Legacy FORM_SECTIONS for backward compatibility
export const FORM_SECTIONS: Record<FormSection, { title: string; titleTh: string; icon: string }> = {
  product_images: { title: 'Product Images', titleTh: 'รูปภาพสินค้า', icon: 'image' },
  basic_info: { title: 'Basic Information', titleTh: 'ข้อมูลพื้นฐาน', icon: 'file-text' },
  specifications: { title: 'Product Specifications', titleTh: 'รายละเอียดสินค้า', icon: 'settings' },
  pricing: { title: 'Pricing & Cost', titleTh: 'ราคาและต้นทุน', icon: 'dollar-sign' },
  dimensions: { title: 'Dimensions & Weight', titleTh: 'ขนาดและน้ำหนัก', icon: 'ruler' },
  logistics: { title: 'Logistics & Supply Chain', titleTh: 'โลจิสติกส์', icon: 'truck' },
  compliance: { title: 'Compliance & Certification', titleTh: 'การรับรอง', icon: 'shield-check' },
  store_allocation: { title: 'Store Allocation', titleTh: 'การจัดสรรสาขา', icon: 'store' },
  additional: { title: 'Additional Information', titleTh: 'ข้อมูลเพิ่มเติม', icon: 'plus-circle' },
};

// NPD Form Field Definition - Extended for new input types
export interface NPDFormField {
  id: string;
  name: string;
  nameTh?: string;
  section: FormSection | SupplierFormSection;
  channel: ChannelType;
  requirement: FieldRequirement;
  inputType: FieldInputType;
  applicableDivisions: Division[] | 'all';
  assignedTo: UserType[];
  dropdownOptions?: string[];
  conditionalOn?: string;
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
}

// Form State
export interface NPDFormState {
  currentStep: number;
  selectedDivision: Division | null;
  userType: UserType | null;
  channel: ChannelType;
  formData: Record<string, string | number | File | null>;
  completedSections: (FormSection | SupplierFormSection)[];
  errors: Record<string, string>;
}

// Item Type
export type ItemType = 'new_item' | 'join_item' | 'reactivate';

export const ITEM_TYPES: Record<ItemType, { label: string; labelTh: string }> = {
  new_item: { label: 'New Item', labelTh: 'สินค้าใหม่' },
  join_item: { label: 'Join Item', labelTh: 'สินค้าเข้าร่วม' },
  reactivate: { label: 'Re-Activate', labelTh: 'เปิดใช้งานอีกครั้ง' },
};

// Temperature Types
export type TemperatureType = 'ambient' | 'chill' | 'frozen';

export const TEMPERATURE_TYPES: Record<TemperatureType, { label: string; range: string }> = {
  ambient: { label: 'Ambient', range: 'Room Temperature' },
  chill: { label: 'Chill', range: '0-4°C' },
  frozen: { label: 'Frozen', range: '-18°C or below' },
};

// Supplier Form Steps (ordered)
export const SUPPLIER_FORM_STEPS: SupplierFormSection[] = [
  'product_identification',
  'product_images',
  'basic_attributes',
  'compliance',
  'pricing',
  'logistics',
  'system_fields',
];

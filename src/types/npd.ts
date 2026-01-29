// NPD (New Product Development) Type Definitions

// Product Divisions - Different product categories
export type Division = 'HL' | 'HOL' | 'DF' | 'NF' | 'SL' | 'FF' | 'PH' | 'NSD';

export const DIVISIONS: Record<Division, { label: string; fullName: string; color: string }> = {
  HL: { label: 'HL', fullName: 'Hard Lines', color: 'division-hl' },
  HOL: { label: 'HOL', fullName: 'Home Office Living', color: 'division-hol' },
  DF: { label: 'DF', fullName: 'Dairy & Frozen', color: 'division-df' },
  NF: { label: 'NF', fullName: 'Non-Food', color: 'division-nf' },
  SL: { label: 'SL', fullName: 'Soft Lines', color: 'division-sl' },
  FF: { label: 'FF', fullName: 'Fresh Food', color: 'division-ff' },
  PH: { label: 'PH', fullName: 'Pharmacy', color: 'division-ph' },
  NSD: { label: 'NSD', fullName: 'Non-Stock Direct', color: 'bg-gray-100 text-gray-800' },
};

// User Types - Who is filling the form
export type UserType = 'supplier' | 'buyer' | 'commercial' | 'finance' | 'scm' | 'im' | 'dc_income';

export const USER_TYPES: Record<UserType, { label: string; description: string }> = {
  supplier: { label: 'Supplier', description: 'External supplier/vendor' },
  buyer: { label: 'Buyer', description: 'Internal buyer/merchandiser' },
  commercial: { label: 'Commercial', description: 'Commercial team' },
  finance: { label: 'Finance', description: 'Finance department' },
  scm: { label: 'SCM', description: 'Supply Chain Management' },
  im: { label: 'IM', description: 'Inventory Management' },
  dc_income: { label: 'DC Income', description: 'Distribution Center Income' },
};

// Channel Type - Online vs Offline
export type ChannelType = 'online' | 'offline' | 'both';

// Field Requirement Type
export type FieldRequirement = 'mandatory' | 'optional' | 'conditional';

// Field Input Type
export type FieldInputType = 'text' | 'number' | 'dropdown' | 'date' | 'file' | 'textarea';

// Form Section Categories
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

// NPD Form Field Definition
export interface NPDFormField {
  id: string;
  name: string;
  nameTh?: string;
  section: FormSection;
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
  completedSections: FormSection[];
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

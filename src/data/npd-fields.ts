// Re-export supplier fields as the primary field source
// This file now serves as a facade for backward compatibility

import { NPDFormField, Division, UserType, SupplierFormSection, FormSection } from '@/types/npd';
import { 
  ALL_SUPPLIER_FIELDS, 
  getSupplierFieldsBySection, 
  getSupplierFieldsForDivision,
  getFieldsForSectionAndDivision,
  PRODUCT_IDENTIFICATION_FIELDS,
  PRODUCT_IMAGES_FIELDS,
  BASIC_ATTRIBUTES_FIELDS,
  COMPLIANCE_FIELDS,
  PRICING_FIELDS,
  LOGISTICS_FIELDS,
  SYSTEM_FIELDS,
} from './npd-fields-supplier';

// Re-export supplier fields
export {
  ALL_SUPPLIER_FIELDS,
  getSupplierFieldsBySection,
  getSupplierFieldsForDivision,
  getFieldsForSectionAndDivision,
  PRODUCT_IDENTIFICATION_FIELDS,
  PRODUCT_IMAGES_FIELDS,
  BASIC_ATTRIBUTES_FIELDS,
  COMPLIANCE_FIELDS,
  PRICING_FIELDS,
  LOGISTICS_FIELDS,
  SYSTEM_FIELDS,
};

// Helper function to check if a field applies to a division
export const appliesToDivision = (field: NPDFormField, division: Division): boolean => {
  if (field.applicableDivisions === 'all') return true;
  return field.applicableDivisions.includes(division);
};

// Backward compatible exports - maps to supplier fields
export const ALL_NPD_FIELDS: NPDFormField[] = ALL_SUPPLIER_FIELDS;

// Get fields by legacy section name (maps to new sections)
export const getFieldsBySection = (section: string): NPDFormField[] => {
  // Map legacy section names to new supplier sections
  const sectionMap: Record<string, SupplierFormSection> = {
    'basic_info': 'product_identification',
    'product_images': 'product_images',
    'specifications': 'basic_attributes',
    'pricing': 'pricing',
    'dimensions': 'basic_attributes',
    'logistics': 'logistics',
    'compliance': 'compliance',
    'store_allocation': 'logistics',
    'additional': 'logistics',
  };
  
  const mappedSection = sectionMap[section] || section as SupplierFormSection;
  return getSupplierFieldsBySection(mappedSection);
};

// Get fields for a specific division
export const getFieldsForDivision = (division: Division): NPDFormField[] => {
  return getSupplierFieldsForDivision(division);
};

// Get fields for a specific user type
export const getFieldsForUserType = (userType: UserType): NPDFormField[] => {
  return ALL_SUPPLIER_FIELDS.filter(field => field.assignedTo.includes(userType));
};

// Get fields for a specific context (division) - backward compatible
export const getFieldsForContext = (
  division: Division,
  _arg2?: unknown,
  _arg3?: unknown
): NPDFormField[] => {
  return getSupplierFieldsForDivision(division);
};

// Legacy section-based exports for backward compatibility
export const BASIC_INFO_FIELDS = PRODUCT_IDENTIFICATION_FIELDS;
export const SPECIFICATIONS_FIELDS = BASIC_ATTRIBUTES_FIELDS;
export const DIMENSIONS_FIELDS = BASIC_ATTRIBUTES_FIELDS.filter(f => 
  ['dimension_l', 'dimension_w', 'dimension_h', 'weight_net', 'weight_gross'].includes(f.id)
);
export const STORE_ALLOCATION_FIELDS: NPDFormField[] = [];
export const ADDITIONAL_FIELDS: NPDFormField[] = [];

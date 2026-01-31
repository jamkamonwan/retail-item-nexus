// ============================================================
// Conditional Field Display Logic
// Implements 8 essential conditionals for smart field visibility
// ============================================================

import { NPDFormField, Division } from '@/types/npd';

// Condition types for field visibility
export type ConditionType = 'has_value' | 'equals' | 'not_equals';

// Rule definition for conditional field display
export interface ConditionalRule {
  fieldId: string;
  dependsOn: string;
  condition: ConditionType;
  value?: string;
}

// 8 Essential Conditional Rules + supporting rules
export const CONDITIONAL_RULES: ConditionalRule[] = [
  // 1. TISI image - show when TISI number is filled
  { fieldId: 'image_tisi', dependsOn: 'tisi_number', condition: 'has_value' },
  
  // 2. FDA image - show when FDA number is filled
  { fieldId: 'image_fda', dependsOn: 'fda_number', condition: 'has_value' },
  
  // 3. TISI expiry - show when TISI number is filled
  { fieldId: 'tisi_expiry', dependsOn: 'tisi_number', condition: 'has_value' },
  
  // 4. FDA expiry - show when FDA number is filled
  { fieldId: 'fda_expiry', dependsOn: 'fda_number', condition: 'has_value' },
  
  // 5. Group Name - show when Group By is not "None"
  { fieldId: 'group_name', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  
  // 6. SKU Reference - show when Group By is not "None"
  { fieldId: 'sku_reference', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  
  // 7. Group Barcode - show when Group By is not "None"
  { fieldId: 'group_barcode', dependsOn: 'group_by', condition: 'not_equals', value: 'None' },
  
  // 8. Hex Color Code - show when color is filled
  { fieldId: 'hex_color_code', dependsOn: 'color', condition: 'has_value' },
  
  // 9. Size Standard - show when size is filled (SL division only via applicableDivisions)
  { fieldId: 'size_standard', dependsOn: 'size', condition: 'has_value' },
];

/**
 * Evaluates a single conditional rule against the form data
 */
export function evaluateCondition(
  rule: ConditionalRule,
  formData: Record<string, string | number | File | null>
): boolean {
  const triggerValue = formData[rule.dependsOn];
  
  switch (rule.condition) {
    case 'has_value':
      if (triggerValue === null || triggerValue === undefined) return false;
      if (typeof triggerValue === 'string') return triggerValue.trim() !== '';
      if (typeof triggerValue === 'number') return true;
      if (triggerValue instanceof File) return true;
      return false;
      
    case 'equals':
      return String(triggerValue) === rule.value;
      
    case 'not_equals':
      // Must have a value AND not equal to the specified value
      if (triggerValue === null || triggerValue === undefined || triggerValue === '') {
        return false;
      }
      return String(triggerValue) !== rule.value;
      
    default:
      return true;
  }
}

/**
 * Checks if a field should be visible based on conditional rules
 */
export function isFieldVisible(
  field: NPDFormField,
  formData: Record<string, string | number | File | null>,
  division: Division
): boolean {
  // First check division applicability
  if (field.applicableDivisions !== 'all') {
    if (!field.applicableDivisions.includes(division)) {
      return false;
    }
  }
  
  // Find any conditional rule for this field
  const rule = CONDITIONAL_RULES.find(r => r.fieldId === field.id);
  
  // If there's a rule, evaluate it
  if (rule) {
    return evaluateCondition(rule, formData);
  }
  
  // No rule means field is always visible (subject to division filtering)
  return true;
}

/**
 * Filters an array of fields to only include visible ones
 */
export function getVisibleFields(
  fields: NPDFormField[],
  formData: Record<string, string | number | File | null>,
  division: Division
): NPDFormField[] {
  return fields.filter(field => isFieldVisible(field, formData, division));
}

/**
 * Gets the dependent field IDs for a given trigger field
 * Useful for showing feedback about what fields will appear
 */
export function getDependentFields(triggerFieldId: string): string[] {
  return CONDITIONAL_RULES
    .filter(rule => rule.dependsOn === triggerFieldId)
    .map(rule => rule.fieldId);
}

/**
 * Checks if a field has conditional dependents
 */
export function hasDependentFields(fieldId: string): boolean {
  return CONDITIONAL_RULES.some(rule => rule.dependsOn === fieldId);
}

/**
 * Gets the trigger field for a conditional field
 */
export function getTriggerField(conditionalFieldId: string): string | null {
  const rule = CONDITIONAL_RULES.find(r => r.fieldId === conditionalFieldId);
  return rule?.dependsOn || null;
}

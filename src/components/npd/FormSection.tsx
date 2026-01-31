import { NPDFormField, SupplierFormSection, SUPPLIER_FORM_SECTIONS } from '@/types/npd';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface FormSectionProps {
  section: SupplierFormSection;
  fields: NPDFormField[];
  values: Record<string, string | number | File | null>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: string | number | File | null) => void;
  calculatedValues?: Record<string, number | null>;
}

export function FormSectionComponent({ section, fields, values, errors, onChange, calculatedValues }: FormSectionProps) {
  const sectionInfo = SUPPLIER_FORM_SECTIONS[section];
  
  // Group fields by requirement
  const mandatoryFields = fields.filter(f => f.requirement === 'mandatory');
  const conditionalFields = fields.filter(f => f.requirement === 'conditional');
  const optionalFields = fields.filter(f => f.requirement === 'optional');

  const renderFieldGroup = (groupFields: NPDFormField[], title?: string, className?: string, isConditional?: boolean) => {
    if (groupFields.length === 0) return null;
    
    return (
      <div className={cn('space-y-4', className)}>
        {title && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </h4>
              {isConditional && (
                <Sparkles className="w-4 h-4 text-warning animate-pulse" />
              )}
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {groupFields.length} field{groupFields.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {isConditional && groupFields.length > 0 && (
          <p className="text-xs text-muted-foreground -mt-2">
            Shown based on your entries above
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupFields.map((field) => (
            <div
              key={field.id}
              className={cn(
                field.inputType === 'textarea' && 'md:col-span-2',
                field.inputType === 'file' && 'md:col-span-1',
                // Animation for conditional fields
                field.requirement === 'conditional' && 'animate-in fade-in slide-in-from-top-2 duration-300'
              )}
            >
              <FormField
                field={field}
                value={values[field.id] || null}
                onChange={(value) => onChange(field.id, value)}
                error={errors[field.id]}
                calculatedValue={calculatedValues?.[field.id]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-primary">
          {sectionInfo.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {sectionInfo.titleTh}
        </p>
      </div>

      {/* Field Legend */}
      <div className="flex flex-wrap gap-4 text-sm bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-destructive font-bold">*</span>
          <span className="text-muted-foreground">Mandatory ({mandatoryFields.length})</span>
        </div>
        {conditionalFields.length > 0 && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-warning" />
            <span className="text-muted-foreground">Conditional ({conditionalFields.length})</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">○</span>
          <span className="text-muted-foreground">Optional ({optionalFields.length})</span>
        </div>
      </div>

      {/* Mandatory Fields */}
      {renderFieldGroup(mandatoryFields, 'Required Fields', 'bg-card p-6 rounded-lg border')}

      {/* Conditional Fields - with special styling and animation indicator */}
      {renderFieldGroup(
        conditionalFields, 
        'Conditional Fields', 
        'bg-warning/5 p-6 rounded-lg border border-warning/20',
        true
      )}

      {/* Optional Fields */}
      {renderFieldGroup(optionalFields, 'Optional Fields', 'bg-muted/30 p-6 rounded-lg border')}

      {fields.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No fields to display for this section based on your division selection.</p>
        </div>
      )}
    </div>
  );
}
